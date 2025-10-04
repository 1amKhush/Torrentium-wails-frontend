import {
  SelectFile,
  AddFile,
  ListLocalFiles,
  DownloadFile,
} from "../wailsjs/go/main/App";
import { EventsOn, EventsOff } from "../wailsjs/runtime/runtime";

export const selectFile = async () => {
  try {
    return await SelectFile();
  } catch (error) {
    console.error("Error selecting file:", error);
    throw error;
  }
};

export const addFile = async (filePath) => {
  try {
    return await AddFile(filePath);
  } catch (error) {
    console.error("Error adding file:", error);
    throw error;
  }
};

export const listLocalFiles = async () => {
  try {
    return await ListLocalFiles();
  } catch (error) {
    console.error("Error listing local files:", error);
    return [];
  }
};

export const downloadFile = async (cid) => {
  try {
    await DownloadFile(cid);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const onDownloadComplete = (callback) => {
  EventsOn("download-complete", callback);
  return () => EventsOff("download-complete", callback);
};

export const onDownloadError = (callback) => {
  EventsOn("download-error", callback);
  return () => EventsOff("download-error", callback);
};

export const onDownloadProgress = (callback) => {
  EventsOn("download-progress", callback);
  return () => EventsOff("download-progress", callback);
};
