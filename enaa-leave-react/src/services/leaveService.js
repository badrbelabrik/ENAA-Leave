import api from './api';

export const getLeaveRequests = async () => {
    const response = await api.get('/leave-requests');

    return response.data;
};

export const getLeaveRequest = async (id) => {
    const response = await api.get(`/leave-requests/${id}`);

    return response.data;
};

export const createLeaveRequest = async (data) => {
    const response = await api.post('/leave-requests', data);

    return response.data;
};

export const deleteLeaveRequest = async (id) => {
    const response = await api.delete(`/leave-requests/${id}`);

    return response.data;
};