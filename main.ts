import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

serve(async (req: Request) => {
  const targetUrl = "https://www.bitget.com/v1/finance/launchpool/product/list";

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
    const res = await fetch(targetUrl, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        language: "zh_CN",
        locale: "zh_CN",
      },
      referrer: "https://www.bitget.com/zh-CN/events/launchpool",
      referrerPolicy: "unsafe-url",
      body: JSON.stringify({ pageNo: 1, matchType: 0 }),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

    const data = await res.json();

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Content-Type", "application/json");

    const response = new Response(JSON.stringify(data), {
      headers,
      status: 200,
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
