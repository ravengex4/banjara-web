import axios from 'axios';

const FORMSPREE_ENDPOINT = process.env.REACT_APP_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mqaebeea';

export const submitVisaInquiry = async (data) => {
  try {
    const response = await axios.post(FORMSPREE_ENDPOINT, {
      ...data,
      submission_timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Formspree submission error:', error);
    throw error;
  }
};
