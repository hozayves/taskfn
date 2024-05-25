/* eslint-disable react/prop-types */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../AuthContext';

function TasksList({ id, name, description, due, status, progress }) {
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState(progress);
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(status);

    // Function to post a new comment
    const postComment = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                'http://localhost:8090/task-progress',
                {
                    progressNote: comment,
                    taskId: id
                },
                { withCredentials: true }
            );
            if (res.status !== 200) {
                throw new Error("Failed to post comment. Please try again.");
            }

            setComments(prevComments => [res.data, ...prevComments]);
            setComment("");

        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    // Function to delete a comment
    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const res = await axios.delete(`http://localhost:8090/task-progress/${commentId}`, { withCredentials: true });
            if (res.status !== 200) {
                throw new Error('Failed to delete comment. Please try again.');
            }
            // Update local state after successful deletion
            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskComplete = async () => {
        setLoading(true)
        try {
            const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
            const res = await axios.put(`http://localhost:8090/tasks/${id}/status`,
                newStatus,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.");
            }
            console.log(res)
            setCurrentStatus(newStatus); // Update local state
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:8090/tasks/${id}/status`,
                newStatus,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.");
            }
            setCurrentStatus(newStatus); // Update local state
            console.log(res)
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="collapse border border-base-300 bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium flex justify-between">
                    <span className='capitalize'>{name}</span>
                    <span className="leading-0 font-normal text-sm">Due before <strong>{due}</strong></span>
                </div>
                <div className="collapse-content flex flex-col gap-2">
                    <div className="flex justify-between items-center border rounded-md py-2 px-2">
                        <h3 className="font-semibold">State</h3>
                        <div className="flex gap-2">
                            <span
                                onClick={handleTaskComplete}
                                className={`btn ${currentStatus === "COMPLETED" ? "bg-success" : "btn-info"}`}
                            >{currentStatus === "COMPLETED" ? "COMPLETED" : "FINISH"}</span>
                            <select className="select select-bordered w-full max-w-xs" value={currentStatus} onChange={handleStatusChange}>
                                <option value="TODO">Todo</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="TO_BE_REVIEWED">To be Reviewed</option>
                            </select>
                        </div>
                    </div>
                    <div className="border rounded-md p-2 flex justify-between items-center">
                        <h3 className="font-semibold">Owners</h3>
                        <div className="flex gap-2">
                            <div className="lg:tooltip" data-tip="Yves Muhoza">
                                <button className="btn btn-outline">YV</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start gap-2 border rounded-md p-2">
                        <h3 className="font-semibold">Description</h3>
                        <p>{description}</p>
                    </div>
                    <div className="flex flex-col gap-2 border p-2">
                        <h3 className="font-semibold capitalize">Activity</h3>
                        {comments.length === 0 ? (
                            <p>No comments found.</p>
                        ) : (
                            comments.map((comment, index) => <CommentItem key={index} comment={comment} deleteComment={deleteComment} />)
                        )}
                        {/* Comment input form */}
                        <div>
                            <form onSubmit={(e) => { e.preventDefault(); postComment(); }}>
                                <input
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    type="text"
                                    placeholder="Write a comment here"
                                    className="input input-bordered input-lg w-full max-w-xs"
                                />
                                <button type="submit" className="btn btn-active btn-neutral">Post Comment</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div></>
    )
}

export default TasksList

function CommentItem({ comment, deleteComment }) {
    const { authUser } = useAuthContext();

    return (
        <div className="chat chat-start">
            <div className="chat-header flex gap-2 items-center">
                {authUser.firstName}
                <time className="text-xs opacity-50">{comment.progressDate}</time>
                <span className="btn btn-link" onClick={() => deleteComment(comment.id)}>Delete</span>
            </div>
            <div className="chat-bubble">{comment.progressNote}</div>
        </div>
    );
}