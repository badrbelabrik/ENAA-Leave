import api from "./authService";

export const getLeaveRequests = async () => {
    const response = await api.get("/leave-requests");

    return response.data.leave_requests;
};

export const getLeaveRequest = async (id) => {
    const response = await api.get(`/leave-requests/${id}`);

    return response.data.leave_request;
};

export const createLeaveRequest = async (data) => {
    const response = await api.post("/leave-requests", data);

    return response.data;
};

export const cancelLeaveRequest = async (id) => {
    const response = await api.delete(`/leave-requests/${id}`);

    return response.data;
};

export const approveLeaveRequest = async (id) => {
    const response = await api.post(
        `/leave-requests/${id}/approve`
    );

    return response.data;
};

export const rejectLeaveRequest = async (id, comment) => {
    const response = await api.post(
        `/leave-requests/${id}/reject`,
        {
            comment,
        }
    );

    return response.data;
};

export const getHrLeaveRequests = async () => {
    const response = await api.get("/hr/leave-requests");

    console.log("HR API RESPONSE:", response.data);

    return response.data.leave_requests.data;
};