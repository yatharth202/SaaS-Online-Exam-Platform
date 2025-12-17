import { ApiResponse } from "../utils/ApiResponse.js";

export const studentDashboard = async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        studentId: req.user._id,
        role: req.user.role
      },
      "Student dashboard accessed"
    )
  );
};
