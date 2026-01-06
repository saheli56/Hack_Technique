const API_BASE_URL = 'http://localhost:3001/api';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const jobsAPI = {
  getAll: () => apiRequest('/jobs'),
  getById: (id) => apiRequest(`/jobs/${id}`),
  getByEmployer: (employerId) => apiRequest(`/jobs/employer/${employerId}`),
  create: (jobData) => apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
  update: (id, jobData) => apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),
  delete: (id, employerId) => apiRequest(`/jobs/${id}?employerId=${employerId}`, {
    method: 'DELETE',
  }),
  search: (query) => apiRequest(`/jobs/search?q=${encodeURIComponent(query)}`),
};

export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

export const employersAPI = {
  getAll: () => apiRequest('/employers'),
  getById: (id) => apiRequest(`/employers/${id}`),
  create: (employerData) => apiRequest('/employers', {
    method: 'POST',
    body: JSON.stringify(employerData),
  }),
  login: (credentials) => apiRequest('/employers/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

export const applicationsAPI = {
  getAll: () => apiRequest('/applications'),
  getByUserId: (userId) => apiRequest(`/applications/user/${userId}`),
  getByJobId: (jobId) => apiRequest(`/applications/job/${jobId}`),
  create: (applicationData) => apiRequest('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),
  updateStatus: (id, statusData) => apiRequest(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
};

export const postsAPI = {
  getAll: () => apiRequest('/posts'),
  create: (postData) => apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),
  addComment: (postId, commentData) => apiRequest(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(commentData),
  }),
  like: (postId) => apiRequest(`/posts/${postId}/like`, {
    method: 'POST',
  }),
  delete: (postId, userId) => apiRequest(`/posts/${postId}?userId=${userId}`, {
    method: 'DELETE',
  }),
};

export const loansAPI = {
  getAll: () => apiRequest('/loans'),
  create: (loanData) => apiRequest('/loans', {
    method: 'POST',
    body: JSON.stringify(loanData),
  }),
};

export const seedAPI = {
  seedDatabase: () => apiRequest('/seed', {
    method: 'POST',
  }),
};