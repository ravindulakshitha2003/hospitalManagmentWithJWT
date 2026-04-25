import api from './api';

const docterService= {

  createReport: async (reportData) => {
    console.log(reportData)
    try {
      const response = await api.post(
        '/api/v1/docter/createReport',
       reportData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

};

export default  docterService;