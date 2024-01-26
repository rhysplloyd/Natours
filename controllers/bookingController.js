const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getCheckoutSession = catchAsync(
  async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    if (!tour)
      return next(
        new AppError('Please specify a valid tour ID', 404),
      );
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get(
        'host',
      )}/?tour=${req.params.tourId}&user=${
        req.user.id
      }&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get(
        'host',
      )}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourID,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              images: [
                `http://localhost:3000/img/tours/${tour.imageCover}`,
              ],
              description: tour.summary,
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    // 2) Send session to client
    res.status(200).json({
      status: 'success',
      session,
    });
  },
);

exports.createBookingCheckout = catchAsync(
  async (req, res, next) => {
    // UNSECURE TEMPORARY - ALLOWS ANYONE TO MAKE UNPAID BOOKINGS
    const { tour, user, price } = req.query;
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
  },
);
