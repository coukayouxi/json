// cloud-extension-chinese.js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('云扩展必须在非沙盒模式下运行');
  }

  class CloudExtension {
    constructor() {
      this.supabase = null;
      this.projectId = '';
      this.supabaseUrl = '';
      this.supabaseKey = '';
      this.isInitialized = false;
      this.variables = {};
      this.lists = {};
    }

    getInfo() {
      return {
        id: 'cloudExtension',
        name: '云变量与云列表',
        color1: '#4a90e2',
        color2: '#357abd',
        blocks: [
          // 配置积木
          {
            opcode: 'configureSupabase',
            blockType: Scratch.BlockType.COMMAND,
            text: '配置Supabase网址[url]密钥[key]',
            arguments: {
              url: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://your-project.supabase.co'
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'your-anon-key'
              }
            }
          },
          
          {
            opcode: 'setProjectId',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置项目ID为[projectId]',
            arguments: {
              projectId: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'project_123'
              }
            }
          },
          {
            opcode: 'getProjectId',
            blockType: Scratch.BlockType.REPORTER,
            text: '项目ID',
            disableMonitor: true
          },

          '---', // 分隔线

          // 云变量积木
          {
            opcode: 'setCloudVariable',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置云变量[variable]为[value]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'getCloudVariable',
            blockType: Scratch.BlockType.REPORTER,
            text: '云变量[variable]',
            arguments: {
              variable: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score'
              }
            }
          },

          '---', // 分隔线

          // 云列表积木
          {
            opcode: 'addToList',
            blockType: Scratch.BlockType.COMMAND,
            text: '将[item]添加到云列表[list]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'deleteFromList',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除云列表[list]的第[index]项',
            arguments: {
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'insertAtList',
            blockType: Scratch.BlockType.COMMAND,
            text: '在云列表[list]的第[index]位置插入[item]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'replaceItemOfList',
            blockType: Scratch.BlockType.COMMAND,
            text: '将云列表[list]第[index]项替换为[item]',
            arguments: {
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              }
            }
          },
          {
            opcode: 'getItemOfList',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表[list]第[index]项',
            arguments: {
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'lengthOfList',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表[list]的长度',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'listContainsItem',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '云列表[list]包含[item]？',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              },
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              }
            }
          },
          {
            opcode: 'deleteAllOfList',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空云列表[list]',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'cloudListContents',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表[list]',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },

          '---', // 分隔线

          // 云列表与文字转换积木
          {
            opcode: 'listToText',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表[list]转为文字(分隔符[separator])',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              },
              separator: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ' '
              }
            }
          },
          {
            opcode: 'textToList',
            blockType: Scratch.BlockType.COMMAND,
            text: '将文字[text]按分隔符[separator]转为云列表[list]',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '项目1 项目2 项目3'
              },
              separator: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ' '
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'listToJson',
            blockType: Scratch.BlockType.REPORTER,
            text: '云列表[list]转为JSON',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          },
          {
            opcode: 'jsonToList',
            blockType: Scratch.BlockType.COMMAND,
            text: '将JSON[text]转为云列表[list]',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["项目1","项目2","项目3"]'
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my list'
              }
            }
          }
        ]
      };
    }

    // 加载Supabase库
    loadSupabaseLibrary() {
      return new Promise((resolve, reject) => {
        if (typeof supabase !== 'undefined') {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // 配置Supabase
    async configureSupabase(args) {
      this.supabaseUrl = args.url;
      this.supabaseKey = args.key;
      
      try {
        // 动态加载Supabase
        await this.loadSupabaseLibrary();
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
        this.isInitialized = true;
        console.log('Supabase配置成功');
      } catch (error) {
        console.error('配置Supabase失败:', error);
      }
    }

    // 设置项目ID
    setProjectId(args) {
      this.projectId = args.projectId;
    }

    // 获取项目ID
    getProjectId() {
      return this.projectId;
    }

    // 云变量方法
    async setCloudVariable(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        const { error } = await this.supabase
          .from('cloud_variables')
          .upsert({
            project_id: this.projectId,
            variable_name: args.variable,
            variable_value: String(args.value)
          }, {
            onConflict: 'project_id,variable_name'
          });

        if (error) throw error;
      } catch (error) {
        console.error('设置变量失败:', error);
      }
    }

    async getCloudVariable(args) {
      if (!this.isInitialized || !this.projectId) return '0';
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_variables')
          .select('variable_value')
          .eq('project_id', this.projectId)
          .eq('variable_name', args.variable)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return '0';
          }
          throw error;
        }

        return data.variable_value || '0';
      } catch (error) {
        console.error('获取变量失败:', error);
        return '0';
      }
    }

    // 云列表方法
    async addToList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        // 首先获取当前列表
        const { data: existingData, error: fetchError } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        let currentList = [];
        if (existingData && Array.isArray(existingData.list_data)) {
          currentList = existingData.list_data;
        }

        // 添加新项
        currentList.push(args.item);

        // 更新数据库
        const { error: upsertError } = await this.supabase
          .from('cloud_lists')
          .upsert({
            project_id: this.projectId,
            list_name: args.list,
            list_data: currentList
          }, {
            onConflict: 'project_id,list_name'
          });

        if (upsertError) throw upsertError;
      } catch (error) {
        console.error('添加到列表失败:', error);
      }
    }

    async deleteFromList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        // 获取当前列表
        const { data: existingData, error: fetchError } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // 未找到
            return;
          }
          throw fetchError;
        }

        let currentList = [];
        if (existingData && Array.isArray(existingData.list_data)) {
          currentList = existingData.list_data;
        }

        const index = Number(args.index) - 1; // Scratch索引从1开始
        if (index >= 0 && index < currentList.length) {
          currentList.splice(index, 1);

          // 更新数据库
          const { error: upsertError } = await this.supabase
            .from('cloud_lists')
            .upsert({
              project_id: this.projectId,
              list_name: args.list,
              list_data: currentList
            }, {
              onConflict: 'project_id,list_name'
            });

          if (upsertError) throw upsertError;
        }
      } catch (error) {
        console.error('从列表删除失败:', error);
      }
    }

    async insertAtList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        // 获取当前列表
        const { data: existingData, error: fetchError } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        let currentList = [];
        if (existingData && Array.isArray(existingData.list_data)) {
          currentList = existingData.list_data;
        }

        const index = Number(args.index) - 1; // Scratch索引从1开始
        if (index >= 0 && index <= currentList.length) {
          currentList.splice(index, 0, args.item);

          // 更新数据库
          const { error: upsertError } = await this.supabase
            .from('cloud_lists')
            .upsert({
              project_id: this.projectId,
              list_name: args.list,
              list_data: currentList
            }, {
              onConflict: 'project_id,list_name'
            });

          if (upsertError) throw upsertError;
        }
      } catch (error) {
        console.error('插入到列表失败:', error);
      }
    }

    async replaceItemOfList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        // 获取当前列表
        const { data: existingData, error: fetchError } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // 未找到
            return;
          }
          throw fetchError;
        }

        let currentList = [];
        if (existingData && Array.isArray(existingData.list_data)) {
          currentList = existingData.list_data;
        }

        const index = Number(args.index) - 1; // Scratch索引从1开始
        if (index >= 0 && index < currentList.length) {
          currentList[index] = args.item;

          // 更新数据库
          const { error: upsertError } = await this.supabase
            .from('cloud_lists')
            .upsert({
              project_id: this.projectId,
              list_name: args.list,
              list_data: currentList
            }, {
              onConflict: 'project_id,list_name'
            });

          if (upsertError) throw upsertError;
        }
      } catch (error) {
        console.error('替换列表项失败:', error);
      }
    }

    async getItemOfList(args) {
      if (!this.isInitialized || !this.projectId) return '';
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return '';
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          const index = Number(args.index) - 1; // Scratch索引从1开始
          if (index >= 0 && index < data.list_data.length) {
            return data.list_data[index];
          }
        }
        return '';
      } catch (error) {
        console.error('获取列表项失败:', error);
        return '';
      }
    }

    async lengthOfList(args) {
      if (!this.isInitialized || !this.projectId) return 0;
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return 0;
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          return data.list_data.length;
        }
        return 0;
      } catch (error) {
        console.error('获取列表长度失败:', error);
        return 0;
      }
    }

    async listContainsItem(args) {
      if (!this.isInitialized || !this.projectId) return false;
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return false;
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          return data.list_data.includes(args.item);
        }
        return false;
      } catch (error) {
        console.error('检查列表包含项失败:', error);
        return false;
      }
    }

    async deleteAllOfList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        const { error } = await this.supabase
          .from('cloud_lists')
          .upsert({
            project_id: this.projectId,
            list_name: args.list,
            list_data: []
          }, {
            onConflict: 'project_id,list_name'
          });

        if (error) throw error;
      } catch (error) {
        console.error('清空列表失败:', error);
      }
    }

    async cloudListContents(args) {
      if (!this.isInitialized || !this.projectId) return '';
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return '';
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          return data.list_data.join(' ');
        }
        return '';
      } catch (error) {
        console.error('获取列表内容失败:', error);
        return '';
      }
    }

    // 新增：云列表转文字
    async listToText(args) {
      if (!this.isInitialized || !this.projectId) return '';
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return '';
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          return data.list_data.join(args.separator || ' ');
        }
        return '';
      } catch (error) {
        console.error('列表转文字失败:', error);
        return '';
      }
    }

    // 新增：文字转云列表
    async textToList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        const items = args.text ? args.text.split(args.separator || ' ') : [];
        
        const { error } = await this.supabase
          .from('cloud_lists')
          .upsert({
            project_id: this.projectId,
            list_name: args.list,
            list_data: items
          }, {
            onConflict: 'project_id,list_name'
          });

        if (error) throw error;
      } catch (error) {
        console.error('文字转列表失败:', error);
      }
    }

    // 新增：云列表转JSON
    async listToJson(args) {
      if (!this.isInitialized || !this.projectId) return '[]';
      
      try {
        const { data, error } = await this.supabase
          .from('cloud_lists')
          .select('list_data')
          .eq('project_id', this.projectId)
          .eq('list_name', args.list)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // 未找到
            return '[]';
          }
          throw error;
        }

        if (data && Array.isArray(data.list_data)) {
          return JSON.stringify(data.list_data);
        }
        return '[]';
      } catch (error) {
        console.error('列表转JSON失败:', error);
        return '[]';
      }
    }

    // 新增：JSON转云列表
    async jsonToList(args) {
      if (!this.isInitialized || !this.projectId) return;
      
      try {
        let items = [];
        if (args.text) {
          try {
            items = JSON.parse(args.text);
            if (!Array.isArray(items)) {
              items = [];
            }
          } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            items = [];
          }
        }
        
        const { error } = await this.supabase
          .from('cloud_lists')
          .upsert({
            project_id: this.projectId,
            list_name: args.list,
            list_data: items
          }, {
            onConflict: 'project_id,list_name'
          });

        if (error) throw error;
      } catch (error) {
        console.error('JSON转列表失败:', error);
      }
    }
  }

  Scratch.extensions.register(new CloudExtension());
})(Scratch);
