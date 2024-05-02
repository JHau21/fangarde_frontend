import { Stripe, loadStripe } from "@stripe/stripe-js";
import { create } from "zustand";

type UseStripeState = {
	stripe_instance: Stripe | null;

	create_stripe_instance: () => void;
	get_stripe_instance: () => Stripe;
	reset: () => void;
};

export const use_stripe = create<UseStripeState>((set, get) => ({
	stripe_instance: null,

	create_stripe_instance: async () => {
		const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string;
		const stripe_instance = await loadStripe(key);

		set({ stripe_instance });
	},
	get_stripe_instance: () => get().stripe_instance as Stripe,
	reset: () => set({ stripe_instance: null }),
}));
