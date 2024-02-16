import { AxiosResponse } from 'axios';
import { api } from './api';

interface BacksketchResponse {
  status: {
    httpStatus: string;
    code: number;
    message: string;
  };
  content: {
    sketchId: number;
    sketchImageUrl: string;
  };
}

interface TempIdResponse {
  status: {
    httpStatus: string;
    code: number;
    message: string;
  };
  content: {
    subjectId: null;
    subjectSketch: null;
    tempId: string;
  };
}

interface DrawingResponse {
  status: {
    httpStatus: string;
    code: number;
    message: string;
  };
  content: null;
}

const getBacksketch = async (
  subjectId: number,
): Promise<BacksketchResponse> => {
  try {
    const response = await api.get(`/api/subjects/${subjectId}/sketches`);
    return response.data;
  } catch (error) {
    console.log('랜딩페이지 백스케치 조회 에러', error);
    throw error;
  }
};

const postTempId = async (): Promise<TempIdResponse> => {
  try {
    const response = await api.post(`/api/tempId`);
    return response.data;
  } catch (error) {
    console.log('임시아이디 발급 에러', error);
    throw error;
  }
};

const postDrawing = async (
  subjectId: number,
  tempId: string,
  formData: FormData,
): Promise<DrawingResponse> => {
  try {
    const response = await api.post(
      `api/canvases/demo/subject/${subjectId}/tempId/${tempId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.log('랜딩 페이지 변환하기 실패', error);
    throw error;
  }
};

export { getBacksketch, postTempId, postDrawing };
