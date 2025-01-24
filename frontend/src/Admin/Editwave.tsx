import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import { createAuthHeaders } from "../utils/token";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Editwave = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/adminLogin");
    }
  }, []);
  const { id } = useParams();
  const [mediaPreview, setMediaPreview] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    text: "",
    media: null as File | null,
  });

  const { data: waveData, isLoading: load } = useQuery({
    queryKey: ["waveDetail", id],
    queryFn: async () => {
      const response = await api.get(`${Local.GET_WAVE}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (waveData) {
      setInitialValues({
        text: waveData.text,
        media: null,
      });

      if (waveData.mediaUrl) {
        const fileType = waveData.mediaType;
        setMediaPreview({
          url: waveData.mediaUrl,
          type: fileType || "image/*",
        });
      }
    }
  }, [waveData]);

  useEffect(() => {
    return () => {
      if (mediaPreview?.url.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreview.url);
      }
    };
  }, [mediaPreview]);

  const validationSchema = Yup.object({
    text: Yup.string().required("Wave text is required"),
    media: Yup.mixed().notRequired(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("text", values.text);

    if (values.media) {
      formData.append("media", values.media);
    }

    try {
      await api.put(
        `${Local.EDIT_WAVE}/${id}`,
        formData,
        createAuthHeaders(adminToken)
      );
      toast.success("Wave updated successfully");
      navigate("/manageWaves");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating wave");
    } finally {
      setIsLoading(false);
    }
  };

  if (load) return <div>Loading...</div>;

  return (
    <div className="container py-5">
      <h2
        className="mb-4 text-start"
        onClick={() => {
          navigate("/manageWaves");
        }}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 26 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="me-4 pt-1"
        >
          <path
            d="M25.3467 10.4067C25.3467 10.9899 24.9133 11.472 24.3509 11.5483L24.1946 11.5588L1.15258 11.5588C0.516294 11.5588 0.000482559 11.043 0.000482559 10.4067C0.000482559 9.82341 0.433908 9.34138 0.99625 9.26509L1.15258 9.25458L24.1946 9.25458C24.8309 9.25458 25.3467 9.77039 25.3467 10.4067Z"
            fill="#292929"
            fillOpacity="0.8"
          />
          <path
            d="M11.2588 18.8446C11.7097 19.2935 11.7112 20.023 11.2623 20.4739C10.8541 20.8838 10.2142 20.9223 9.76242 20.5886L9.63296 20.4774L0.339355 11.2237C-0.0717716 10.8144 -0.109172 10.1721 0.227171 9.72034L0.339287 9.59096L9.63289 0.335757C10.0837 -0.113233 10.8132 -0.111723 11.2622 0.339131C11.6704 0.748998 11.7062 1.38912 11.3706 1.83946L11.2588 1.96844L2.78547 10.4078L11.2588 18.8446Z"
            fill="#292929"
            fillOpacity="0.8"
          />
        </svg>
        Edit Wave
      </h2>
      <div className="card p-4 shadow-sm border-0">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="text" className="form-label fw-bold">
                  Wave Text
                </label>
                <Field
                  type="text"
                  name="text"
                  id="text"
                  placeholder="Enter wave text"
                  className="form-control"
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="media" className="form-label fw-bold">
                  Upload Media
                </label>
                <input
                  type="file"
                  name="media"
                  id="media"
                  accept="image/*,video/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setFieldValue("media", file);
                      setMediaPreview({
                        url: URL.createObjectURL(file),
                        type: file.type,
                      });
                    }
                  }}
                  className="form-control"
                />
                <ErrorMessage
                  name="media"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>

              {mediaPreview && (
                <div className="mb-4 text-center">
                  {mediaPreview.type.startsWith("video/") ? (
                    <video
                      src={mediaPreview.url}
                      controls
                      className="img-fluid rounded shadow-sm"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  ) : (
                    <img
                      src={mediaPreview.url}
                      alt="Media Preview"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin me-2"></i>Saving...
                  </span>
                ) : (
                  "Update Wave"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Editwave;
