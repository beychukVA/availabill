import { NextApiRequest, NextApiResponse } from "next";
import { PipelineSource, pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { id, token } = req.query;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/transactions/${id}/invoice`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    if (response.ok) {
      res.setHeader("Content-Type", "application/pdf");

      if (response && response.body) {
        await pipelineAsync(
          response.body as unknown as PipelineSource<
            ReadableStream<Uint8Array>
          >,
          res
        );

        return;
      }

      throw new Error();
    } else {
      console.error(
        "Failed to fetch PDF:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error occurred while fetching PDF:", error);
  }
}
