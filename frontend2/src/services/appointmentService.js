import api from './api';

const  appointmentService = {

        createAppointment : async (patient,docter, price, status, reason, visitType) => {
    try {
      const response = await api.post('api/v1/User/addAppoinment', {
        patient,
        docter, 
        price, 
        status,
        reason,
        visitType,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },


   docters : async () => {
  try {
    const response = await api.get('/api/v1/User/allDocters');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

, 
 allappoinment :async (username) => {
  try {
    const response = await api.post('/api/v1/User/allAppinment',
      {
        username
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
 }


}
export  default appointmentService;