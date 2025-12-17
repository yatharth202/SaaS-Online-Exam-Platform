import { ApiResponse } from "../utils/ApiResponse.js";

export const adminOnlyController = (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: req.user },
      "Admin route accessed successfully"
    )
  );
};
