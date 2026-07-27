import { User } from '../models/User.js';
import { stripe, PLANS, planFromPriceId } from '../config/stripe.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getOrCreateStripeCustomer(user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id.toString() },
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
}

export async function applySubscriptionToUser(userId, { plan, status, subscriptionId, customerId }) {
  const user = await User.findById(userId);
  if (!user) return null;

  if (customerId) user.stripeCustomerId = customerId;
  if (subscriptionId) user.stripeSubscriptionId = subscriptionId;

  user.subscriptionPlan = plan || 'free';
  user.subscriptionStatus = status || 'none';
  user.isPremium = plan === 'premium';

  await user.save();
  return user;
}

export async function syncUserFromStripeSubscription(subscription) {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id;

  const user =
    (await User.findOne({ stripeCustomerId: customerId })) ||
    (await User.findById(subscription.metadata?.userId));

  if (!user) return null;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = planFromPriceId(priceId);
  const status = subscription.status;

  const activePlans = ['active', 'trialing'];
  const effectivePlan = activePlans.includes(status) ? plan : 'free';

  user.stripeCustomerId = customerId;
  user.stripeSubscriptionId = subscription.id;
  user.subscriptionPlan = effectivePlan;
  user.subscriptionStatus = normalizeSubscriptionStatus(status);
  user.isPremium = effectivePlan === 'premium';

  await user.save();
  return user;
}

function normalizeSubscriptionStatus(status) {
  const allowed = ['none', 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete'];
  if (allowed.includes(status)) return status;
  return 'active';
}

export function getBillingStatus(user) {
  return {
    plan: user.subscriptionPlan || 'free',
    status: user.subscriptionStatus || 'none',
    isPremium: user.isPremium,
    isLite: user.subscriptionPlan === 'lite',
    isPaid: user.subscriptionPlan === 'lite' || user.subscriptionPlan === 'premium',
    canManageBilling: Boolean(user.stripeCustomerId),
    plans: PLANS,
  };
}

export function validateCheckoutPlan(planId) {
  if (!['lite', 'premium'].includes(planId)) {
    throw new AppError('Invalid plan. Choose lite or premium.', 400, 'Validation error');
  }

  const plan = PLANS[planId];
  if (!plan?.priceId) {
    throw new AppError(
      `Stripe price not configured for ${planId}. Set STRIPE_PRICE_${planId.toUpperCase()} in backend .env`,
      503,
      'Stripe not configured'
    );
  }

  return plan;
}
