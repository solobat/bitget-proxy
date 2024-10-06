import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

serve(async (req: Request) => {
  const baseUrl = "https://www.bitget.com";
  const url = new URL(req.url);
  const targetUrl = `${baseUrl}${url.pathname}${url.search}`;

  // 处理预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const headers = new Headers(req.headers);
    headers.set("accept", "application/json, text/plain, */*");
    headers.set("accept-language", "zh-CN,zh;q=0.9,en;q=0.8");
    headers.set("content-type", "application/json;charset=UTF-8");
    headers.set("language", "zh_CN");
    headers.set("locale", "zh_CN");

    let body = "";
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    const res = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
      referrer: "https://www.bitget.com/zh-CN/events/launchpool",
      referrerPolicy: "unsafe-url",
      mode: "cors",
      credentials: "include",
    });

    const data = await res.json();

    const responseHeaders = new Headers();
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type");
    responseHeaders.set("Content-Type", "application/json");
    console.log("req data", data, targetUrl);
    const response = new Response(JSON.stringify(data), {
      headers: responseHeaders,
      status: res.status,
      statusText: res.statusText,
    });
    console.log("代理请求成功:", response.status, response.statusText);
    return response;
  } catch (error) {
    console.error("代理请求出错:", error);
    return new Response("代理请求失败", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
});
