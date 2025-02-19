// http://localhost:1111/pages/build.html -> http://localhost:4000/:path
const autodeploymentUrl = (path) => `//${location.hostname}:4000/${path}`;

export const checkBuildStatus = async () => {
  try {
    const res = await fetch(autodeploymentUrl('status'));
    if (!res.ok) {
      throw new Error('unable to get build info');
    }
    const data = await res.json();
    if (!data.started) {
      return { building: false };
    }

    return {
      building: true,
      title: data.status,
      startedAt: new Date(data.started),
    };
  } catch (err) {
    console.error(err);
    return { building: false };
  }
};

export const getBuildLog = async () => {
  try {
    const res = await fetch(autodeploymentUrl('log'));
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('unable to get build log');
    }
    return res.body.getReader();
  } catch (err) {
    console.warn(err);
    return null;
  }
};
