import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
// import "../styling/createwave.css";
import { Local } from "../environment/env";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { createAuthHeaders } from "../utils/token";
import "../Styling/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../main";

const fetchUserDetail = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await api.get(
      `${Local.GET_USER_DETAILS}`,
      createAuthHeaders(token)
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const getLatestWaves = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await api.get(
      `${Local.LATEST_WAVES}`,
      createAuthHeaders(token)
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const getAcceptedFriends = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await api.get(
      `${Local.GET_ACCEPTED_FRIENDS}`,
      createAuthHeaders(token)
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch user details");
    }
    return response.data;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const [editCommentId, setEditCommentId] = useState<number | null>(null); // Track which comment is being edited
  const [editedComment, setEditedComment] = useState<string>(""); // Store the edited comment text

  const handleEditClick = (comment: any) => {
    setEditCommentId(comment.id); // Set the ID of the comment being edited
    setEditedComment(comment.comment); // Pre-fill the input with the current comment
  };

  const handleSaveClick = async (commentId: number) => {
    try {
      const response = await api.put(`${Local.EDIT_COMMENT}/${commentId}`, {
        comment: editedComment,
      });
      if (response.status === 200) {
        toast.success("Comment updated");
        setEditCommentId(null); // Exit edit mode
      }
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");
  const [getWave, setGetWave] = useState<any>({});
  const [getFriend, setGetFriend] = useState<any>({});
  // const [getComments, setGetComments] = useState<any>([]);
  // const [id, setId] = useState<any>("");

  const getWaveComments = async (id: any) => {
    try {
      console.log("Fetching comments for ID:", id);
      const response = await api.get(`${Local.GET_COMMENT}/${id}`);

      setComments(response.data);
      return response.data;
    } catch (error) {
      console.error("Error while fetching comments:", error);
      return;
    }
  };

  console.log(">", comments);
  const {
    data: wavesDetail,
    error,
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["latestWaves"],
    queryFn: getLatestWaves,
    // refetchInterval:1000,
    staleTime: 0,
  });

  const { data: acceptedFriends } = useQuery({
    queryKey: ["acceptedFriends"],
    queryFn: getAcceptedFriends,
  });

  const { data: userDetail } = useQuery({
    queryKey: ["userDetail"],
    queryFn: fetchUserDetail,
  });

  // console.log("<>><", WavesComments);

  // Define and return the mutation
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }
      try {
        const response = await api.put(
          `${Local.ADD_COMMENT}`,
          values,
          createAuthHeaders(token)
        );
        return response.data;
      } catch (error: any) {
        console.error(
          "Error while adding comment:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message || "Failed to add comment"
        );
      }
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches to avoid optimistic update being overwritten
      await queryClient.cancelQueries({ queryKey: ["latestWaves"] });

      // Snapshot current data
      const previousData = queryClient.getQueryData(["latestWaves"]);

      return { previousData };
    },
    onSuccess: async (data, variables) => {
      // Force immediate invalidation and refetch
      await queryClient.invalidateQueries({
        queryKey: ["latestWaves"],
        refetchType: "active",
        exact: true,
      });

      // Force immediate refetch
      await refetch();

      toast.success("Comment posted successfully");
    },
    onError: (error: any, variables, context) => {
      // Rollback to previous data on error
      if (context?.previousData) {
        queryClient.setQueryData(["latestWaves"], context.previousData);
      }
      toast.error(`Error: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["latestWaves"] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <div className="m-2">
        {/* Waves */}
        <div>
          <div className="row bg-white p-4 rounded">
            <p className="h5 pb-3">Making Waves</p>

            {wavesDetail?.data?.map((wave: any) => (
              <div
                className="col-12 col-sm-6 col-lg-4 mb-5 "
                data-bs-toggle="modal"
                data-bs-target="#staticBackdropWave"
                onClick={() => {
                  //modal
                  // setId(wave?.id);
                  setGetWave(wave);
                  getWaveComments(wave.id);
                }}
              >
                <div className="d-flex pb-0 border-end ">
                  <div className="d-flex ">
                    <img
                      src={
                        wave.userWave.profilePhoto
                          ? `${Local.BASE_URL}${wave.userWave.profilePhoto}`
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${wave.userWave.firstName} ${wave.userWave.lastName}`
                      }
                      alt="User Profile"
                      className="rounded-circle border"
                      style={{ width: "50px", height: "50px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />

                    <div className="ms-3 small ">
                      <p className="mb-0 Link fw-medium fs-6 ">
                        {wave.userWave.email}
                      </p>
                      <p className="my-0 "> {wave.text} </p>
                      <p className="m-0 Link fw-medium"> Follow </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends */}
        <div className="mt-5 mb-4">
          <div className="row bg-white p-4 rounded">
            <p className="h5 pb-3">Friends</p>

            {acceptedFriends?.data?.map((friend: any) => (
              <div
                className="col-12 col-lg-6 mb-3"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                onClick={() => {
                  setGetFriend(friend);
                }}
              >
                <div className="d-flex pb-0 frnd-card rounded">
                  <div className="d-flex">
                    <div className="pt-2 ps-2">
                      <img
                        src={
                          friend.profilePhoto
                            ? `${Local.BASE_URL}${friend.profilePhoto}`
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${friend.firstName} ${friend.lastName}`
                        }
                        alt="User Profile"
                        className="rounded-circle border"
                        style={{ width: "50px", height: "50px" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                    </div>

                    <div className="ms-3 small cmn-clr">
                      <p className="mb-0 mt-1 fw-bold fs-6">
                        {friend.firstName} {friend.lastName}
                      </p>
                      <p className="mt-0">{friend.email}</p>
                    </div>
                  </div>

                  <div className="ms-auto mt-3 me-4">
                    <p className="badge bg-success fw-medium rounded-4 px-3">
                      Accepted
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {getFriend && (
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content">
              <div className="mx-2 mt-2 rounded">
                <div className="d-flex justify-content-between align-items-center cw-clr rounded-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="close-friend"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setGetFriend({
                        firstname: getFriend.firstName,
                        lastname: getFriend.lastName,
                      });
                    }}
                  >
                    <circle cx="9" cy="9" r="9" fill="#DECAA5" />
                    <line
                      x1="5.35355"
                      y1="4.64645"
                      x2="14.3536"
                      y2="13.6464"
                      stroke="#B18D4B"
                    />
                    <line
                      y1="-0.5"
                      x2="12.7279"
                      y2="-0.5"
                      transform="matrix(-0.707107 0.707107 0.707107 0.707107 14 5)"
                      stroke="#B18D4B"
                    />
                  </svg>
                  <h1 className="fw-bold ms-auto me-5 cw-clr display-1 ">
                    Details
                  </h1>
                </div>
              </div>

              <div className="photo ms-5 mb-0 pb-0  main-img-div ">
                <div className="d-flex photo">
                  {getFriend.profilePhoto && (
                    <img
                      src={`${Local.BASE_URL}${getFriend.profilePhoto}`}
                      alt="User Profile"
                      className="rounded-5 border mt-4"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  {!getFriend.profilePhoto && (
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${getFriend.firstName} ${getFriend.lastName}`}
                      alt="User Profile"
                      className="rounded-5 border mt-4"
                      style={{ width: "90px", height: "90px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  <p className="ms-5 text-white fs-5 fw-semibold">
                    {getFriend.firstName} {getFriend.lastName}
                    <p className=" text-white pt-0 mt-0 fw-light fs-6">
                      {getFriend.email}
                    </p>
                  </p>
                </div>
                <div>
                  <div className="details fw-semibold">Basic Details</div>
                  <div className="row basic-details">
                    <div className="col-6 ps-4 border-end border-2 text-secondary ">
                      <div className="row">
                        <div className="col-6">
                          <div className="row mb-1">Name: </div>
                          <div className="row mb-1">Email ID: </div>
                          <div className="row mb-1">Mobile No.: </div>
                          <div className="row mb-1">Gender: </div>
                          <div className="row mb-1">State: </div>
                        </div>
                        <div
                          className="col-6 pe-2"
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            overflow: "scroll",
                          }}
                        >
                          <div className="row mb-1">
                            {getFriend.firstName} {getFriend.lastName}
                          </div>
                          <div className="row mb-1"> {getFriend.email} </div>
                          <div className="row mb-1"> {getFriend.phoneNo} </div>
                          <div className="row mb-1">
                            {" "}
                            {getFriend.gender || "----"}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getFriend.state || "----"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 ps-4  ">
                      <div className="row text-secondary ">
                        <div className="col-6">
                          <div className="row mb-1">DOB: </div>
                          <div className="row mb-1">Social Security: </div>
                          <div className="row mb-1">Address: </div>
                          <div className="row mb-1">City: </div>
                          <div className="row mb-1">Zip Code: </div>
                        </div>
                        <div
                          className="col-6"
                          style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            overflow: "scroll",
                          }}
                        >
                          <div className="row mb-1">
                            {getFriend.dob || "----"}
                          </div>
                          <div className="row mb-1">
                            {getFriend.socialSecurity || "----"}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getFriend.addressOne || "----"}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getFriend.city || "----"}
                          </div>
                          <div className="row mb-1">
                            {" "}
                            {getFriend.zipCode || "----"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {getWave && (
        <div
          className="modal fade"
          id="staticBackdropWave"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg ">
            <div className="modal-content">
              <div className="mx-2 mt-2 rounded">
                <div className="d-flex justify-content-between align-items-center cw-clr rounded-3">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="close-friend"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setGetWave({
                        firstname: getWave?.userWave?.firstName,
                        lastname: getWave?.userWave?.lastName,
                      });
                    }}
                  >
                    <circle cx="9" cy="9" r="9" fill="#DECAA5" />
                    <line
                      x1="5.35355"
                      y1="4.64645"
                      x2="14.3536"
                      y2="13.6464"
                      stroke="#B18D4B"
                    />
                    <line
                      y1="-0.5"
                      x2="12.7279"
                      y2="-0.5"
                      transform="matrix(-0.707107 0.707107 0.707107 0.707107 14 5)"
                      stroke="#B18D4B"
                    />
                  </svg>
                  <h1 className="fw-bold mx-auto cw-clr display-1 ">Details</h1>
                </div>
              </div>

              <div className="photo ms-5 mb-0 pb-0  main-img-div ">
                <div className="d-flex photo">
                  {getWave?.userWave?.profilePhoto && (
                    <img
                      src={`${Local.BASE_URL}${getWave?.userWave?.profilePhoto}`}
                      alt="User Profile"
                      className="rounded-circle border mt-3"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  {!getWave?.userWave?.profilePhoto && (
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${getWave?.userWave?.firstName} ${getWave?.userWave?.lastName}`}
                      alt="User Profile"
                      className="rounded-circle border mt-3"
                      style={{ width: "100px", height: "100px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  )}
                  <p className="ms-5 text-white fs-5 fw-semibold">
                    {getWave?.userWave?.firstName} {getWave?.userWave?.lastName}
                    <p className=" text-white pt-0 mt-0 fw-light fs-6">
                      {" "}
                      {getWave?.userWave?.email}{" "}
                    </p>
                  </p>
                </div>
              </div>

              <div className="d-flex felx-wrap ms-4 wave-msg ">
                <div className="d-flex flex-wrap mt-0 w-50  ">
                  <div className="d-flex ">
                    <div className="">
                      <p className="mb-0 fw-semibold ">Message</p>
                      <p className="mt-1 ms-2 text-secondary">
                        {getWave?.text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex photo border-start border-2 border-secondary-subtle">
                  {getWave?.image ? (
                    <img
                      src={`${Local.BASE_URL}${getWave.image}`}
                      alt="User Profile"
                      className="ps-4"
                      style={{ width: "360px", height: "150px" }}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                  ) : getWave?.video ? (
                    <video controls style={{ width: "360px", height: "150px" }}>
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/mp4"
                      />
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/webm"
                      />
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/ogg"
                      />
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/avi"
                      />
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/mov"
                      />
                      <source
                        src={`${Local.BASE_URL}${getWave.video}`}
                        type="video/quicktime"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div>No media available</div>
                  )}
                </div>
              </div>

              <Formik
                initialValues={{
                  comment: "",
                  waveId: "", // Initial value for waveId
                  userId: "", // Initial value for userId
                }}
                onSubmit={async (values: any, { resetForm }) => {
                  try {
                    await mutation.mutateAsync(values);
                    resetForm();
                  } catch (error) {
                    console.error("Mutation failed:", error);
                  }
                }}
              >
                {({ setFieldValue }) => (
                  <Form className="ms-4 comment-btn">
                    <div className="row w-75 mx-auto">
                      {/* Comment Input Field */}
                      <Field
                        name="comment"
                        type="text"
                        className="form-control border-2 col"
                        placeholder="Enter your comment"
                        onClick={() => {
                          setFieldValue("waveId", getWave.id);
                          setFieldValue("userId", userDetail?.user?.id);
                        }}
                      />
                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="col-1 ms-2 rounded btn-clr text-white border-0 "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-send"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                        </svg>
                      </button>
                    </div>

                    <Field type="hidden" name="waveId" />
                    <Field type="hidden" name="userId" />
                  </Form>
                )}
              </Formik>

              <div
                className="ms-4 text-secondary me-2 overflow-auto comments"
                style={{ maxHeight: "150px" }}
              >
                {getWave?.waveComment?.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="mb-0 pb-1 flex items-center justify-between"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {/* Comment Content */}
                    <div className="flex-grow" style={{ flex: 1 }}>
                      {editCommentId === comment.id ? (
                        // Render input for the comment being edited
                        <input
                          type="text"
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          className="form-control"
                          style={{ fontSize: "0.875rem" }}
                        />
                      ) : (
                        <b>
                          {comment?.userComment?.firstName}{" "}
                          {comment?.userComment?.lastName}: {comment?.comment}
                        </b>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {comment?.userId === userDetail?.user?.id && (
                      <div
                        className="flex items-center gap-2 ml-4"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginLeft: "16px",
                        }}
                      >
                        {editCommentId === comment.id ? (
                          <>
                            {/* Save Button */}
                            <button
                              className="btn btn-sm text-green-500 hover:text-green-700"
                              style={{
                                border: "none",
                                background: "none",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                              onClick={() => handleSaveClick(comment.id)}
                            >
                              Save
                            </button>
                            <span className="text-gray-300">|</span>
                            {/* Cancel Button */}
                            <button
                              className="btn btn-sm text-red-500 hover:text-red-700"
                              style={{
                                border: "none",
                                background: "none",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                              onClick={() => setEditCommentId(null)} // Exit edit mode without saving
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Edit Button */}
                            <button
                              className="btn btn-sm text-blue-500 hover:text-blue-700"
                              style={{
                                border: "none",
                                background: "none",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                              onClick={() => handleEditClick(comment)}
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            {/* Delete Button */}
                            <button
                              className="btn btn-sm text-red-500 hover:text-red-700"
                              style={{
                                border: "none",
                                background: "none",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                              onClick={async () => {
                                const response = await api.delete(
                                  `${Local.DELETE_COMMENT}/${comment.id}`
                                );
                                if (response.status === 200) {
                                  toast.success("Comment deleted");
                                }
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
