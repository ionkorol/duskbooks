import firebaseAdmin from "utils/firebaseAdmin";

export default async (req, res) => {
  try {
    res.status(200).json({ order: typeof req });
  } catch (error) {
    res.status(500).json(error);
  }
};
