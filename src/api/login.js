import request from "../request/request";

// 登錄方法
export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data: data,
  });
}

export function getBusLineTimeByLineCode(query) {
  return request({
    url: `/omsScheduleTimeRun/getBusLineTimeByLineCode`,
    method: "get",
    params: query,
  });
}
