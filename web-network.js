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
                defaultValue: '{"key": "value"}'
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
                defaultValue: 'Authorization'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Bearer token'
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
          methodMenu: {
            acceptReporters: false,
            items: [
              {text: 'GET', value: 'GET'},
              {text: 'POST', value: 'POST'},
              {text: 'PUT', value: 'PUT'},
              {text: 'DELETE', value: 'DELETE'},
              {text: 'PATCH', value: 'PATCH'}
            ]
          }
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
        // GET和HEAD请求不能有body
        const config = {
          method: method,
          headers: {
            ...this.headers,
          }
        };

        if (method !== 'GET' && method !== 'HEAD') {
          config.headers['Content-Type'] = 'application/json';
          config.body = data;
        }

        const response = await fetch(url, config);

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
