(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('该扩展必须在非沙盒环境中运行');
  }

  class NetworkExtension {
    getInfo() {
      return {
        id: 'networkextension',
        name: '网络请求',
        color1: '#4a6cd4',
        blocks: [
          {
            opcode: 'makeRequest',
            blockType: Scratch.BlockType.REPORTER,
            text: '发送 [METHOD] 请求到 [URL] 数据 [DATA]',
            arguments: {
              METHOD: {
                type: Scratch.ArgumentType.STRING,
                menu: 'methodMenu'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://httpbin.org/get'
              },
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{}'
              }
            }
          },
          {
            opcode: 'getHeader',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取响应头 [HEADER] 的值',
            arguments: {
              HEADER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'content-type'
              }
            }
          },
          {
            opcode: 'getLastResponseCode',
            blockType: Scratch.BlockType.REPORTER,
            text: '最后一次响应状态码',
          },
          {
            opcode: 'setHeader',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置请求头 [KEY] 为 [VALUE]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'User-Agent'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            }
          },
          {
            opcode: 'clearHeaders',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空所有请求头',
          }
        ],
        menus: {
          methodMenu: [
            {text: 'GET', value: 'GET'},
            {text: 'POST', value: 'POST'},
            {text: 'PUT', value: 'PUT'},
            {text: 'DELETE', value: 'DELETE'},
            {text: 'PATCH', value: 'PATCH'}
          ]
        }
      };
    }

    constructor() {
      this.headers = {};
      this.lastResponseHeaders = {};
      this.lastResponseCode = 0;
    }

    async makeRequest(args) {
      const method = args.METHOD.toUpperCase();
      const url = args.URL;
      let data = args.DATA;

      try {
        let finalUrl = url;
        let config = {
          method: method,
          headers: {
            ...this.headers,
            'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'
          },
          mode: 'cors' // 允许跨域请求
        };

        if (method === 'GET' || method === 'HEAD') {
          // 对于GET请求，如果有数据则作为查询参数
          if (data && data.trim() !== '' && data.trim() !== '{}') {
            try {
              const paramsObj = JSON.parse(data);
              const searchParams = new URLSearchParams(paramsObj);
              finalUrl += (url.includes('?') ? '&' : '?') + searchParams.toString();
            } catch (e) {
              // 如果不是有效的JSON，尝试直接附加
              if (!url.includes('?')) {
                finalUrl += '?' + encodeURIComponent(data);
              } else {
                finalUrl += '&' + encodeURIComponent(data);
              }
            }
          }
        } else {
          config.headers['Content-Type'] = 'application/json';
          config.body = data;
        }

        const response = await fetch(finalUrl, config);

        this.lastResponseCode = response.status;
        this.lastResponseHeaders = {};
        for (const [key, value] of response.headers.entries()) {
          this.lastResponseHeaders[key.toLowerCase()] = value;
        }

        const result = await response.text();
        return result;
      } catch (error) {
        console.error('网络请求失败:', error);
        return `错误: ${error.message}`;
      }
    }

    getHeader(args) {
      const headerName = args.HEADER.toLowerCase();
      return this.lastResponseHeaders[headerName] || '';
    }

    getLastResponseCode() {
      return this.lastResponseCode;
    }

    setHeader(args) {
      const key = args.KEY;
      const value = args.VALUE;
      this.headers[key] = value;
    }

    clearHeaders() {
      this.headers = {};
    }
  }

  Scratch.extensions.register(new NetworkExtension());
})(Scratch);
