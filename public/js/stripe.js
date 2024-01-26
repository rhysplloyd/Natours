import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_rI66o0tzXNjUV9kT1ocOc7WV00WXFCCBZZ',
  );
  try {
    // 1) Get checkout session from server
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2)Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
