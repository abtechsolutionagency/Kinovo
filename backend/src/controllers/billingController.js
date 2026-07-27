import { stripe, getFrontendUrl, assertStripeConfigured } from '../config/stripe.js';
import { User } from '../models/User.js';
import {
  getOrCreateStripeCustomer,
  getBillingStatus,
  validateCheckoutPlan,
  syncUserFromStripeSubscription,
  applySubscriptionToUser,
} from '../services/billingService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getPlans(_req, res) {
  const status = getBillingStatus({ subscriptionPlan: 'free', subscriptionStatus: 'none', isPremium: false });
  return res.json({
    success: true,
    plans: status.plans,
  });
}

export async function getSubscriptionStatus(req, res) {
  return res.json({
    success: true,
    billing: getBillingStatus(req.user),
  });
}

export async function createCheckoutSession(req, res) {
  assertStripeConfigured();
  const { plan: planId } = req.body || {};
  const plan = validateCheckoutPlan(planId);

  const customerId = await getOrCreateStripeCustomer(req.user);
  const frontendUrl = getFrontendUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${frontendUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/pricing/cancel`,
    client_reference_id: req.user._id.toString(),
    metadata: {
      userId: req.user._id.toString(),
      planId: plan.id,
    },
    subscription_data: {
      metadata: {
        userId: req.user._id.toString(),
        planId: plan.id,
      },
    },
    allow_promotion_codes: true,
  });

  return res.json({
    success: true,
    url: session.url,
    sessionId: session.id,
  });
}

export async function createPortalSession(req, res) {
  assertStripeConfigured();

  if (!req.user.stripeCustomerId) {
    throw new AppError('No billing account found. Subscribe to a plan first.', 400, 'No customer');
  }

  const frontendUrl = getFrontendUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: req.user.stripeCustomerId,
    return_url: `${frontendUrl}/pricing`,
  });

  return res.json({
    success: true,
    url: session.url,
  });
}

export async function verifyCheckoutSession(req, res) {
  assertStripeConfigured();
  const sessionId = req.query.session_id || req.query.sessionId;

  if (!sessionId) {
    throw new AppError('session_id is required', 400, 'Validation error');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  const userId = req.user._id.toString();
  const sessionUserId = session.client_reference_id || session.metadata?.userId;

  if (sessionUserId && sessionUserId !== userId) {
    throw new AppError('Session does not belong to this user', 403, 'Forbidden');
  }

  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    throw new AppError('Payment has not been completed yet', 400, 'Payment pending');
  }

  if (session.subscription && typeof session.subscription !== 'string') {
    await syncUserFromStripeSubscription(session.subscription);
  } else if (typeof session.subscription === 'string') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    await syncUserFromStripeSubscription(subscription);
  } else if (session.metadata?.planId) {
    await applySubscriptionToUser(req.user._id, {
      plan: session.metadata.planId,
      status: 'active',
      subscriptionId: session.subscription,
      customerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
    });
  }

  const user = await User.findById(req.user._id);

  return res.json({
    success: true,
    billing: getBillingStatus(user),
    message: 'Subscription activated',
  });
}

export async function handleStripeWebhook(req, res) {
  assertStripeConfigured();

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new AppError('STRIPE_WEBHOOK_SECRET is not configured', 503, 'Stripe not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await syncUserFromStripeSubscription(subscription);
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await syncUserFromStripeSubscription(subscription);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        await syncUserFromStripeSubscription(subscription);
      }
      break;
    }
    default:
      break;
  }

  return res.json({ received: true });
}
