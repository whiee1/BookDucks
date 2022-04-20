module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '5e8b2b7bfad245e2f9d8d937af468e35'),
  },
});
