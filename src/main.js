const axios = require('axios');

class Slash {
    constructor(client, bot_token, bot_id) {
        this.request = {
            'name': '',
            'description': ''
        };
        this.options = [];
        this.tokenPrefix = 'Bot ';
        this.authToken = bot_token
        this.bot_id = bot_id;
        this.endpoints = {
            ENDPOINT: `/applications/${this.bot_id}`,
            GUILD_ONLY: '/guilds/',
            COMMANDS: '/commands',
        }
    }

    /**
     * @param {String} name - Command Name
     * @return {Promise<SlashCommand>}
     */
    async setCommandName(name) {
        return new Promise(async (resolve) => {
            this.request.name = name;
            resolve(this);
        })
    }

    /**
     *
     * @param {String} description - command description
     * @return {Promise<SlashCommand>}
     */
    async setCommandDescription(description) {
        return new Promise(async (resolve) => {
            this.request.description = description;
            resolve(this);
        })
    }

    /**
     *
     * @param {String} name
     * @param {String} description
     * @param {boolean} required
     * @param {Array<Object>} choices
     * @param {String} choices.name
     * @param {String} choices.value
     * @param {int} type
     * @return {Promise<SlashCommand|*>}
     */
    async addOption(name, description, required = true, type = 3, choices = []) {
        return new Promise(async (resolve, reject) => {
            if (name === '') {
                reject('Option Name is undefined!');
            } else if (description === '') {
                reject('Option Description is undefined!')
            }
            
            if (choices.length >= 1)  {
                this.options.push({
                    'name': name,
                    'description': description,
                    'type': type,
                    'required': required,
                    'choices': choices
                })
            }
            else {
                this.options.push({
                    'name': name,
                    'description': description,
                    'type': type,
                    'required': required,
                })
            }
            resolve(this);
        })
    }

    /**
     *
     * @param {String} name
     * @param {String} description
     * @param {int} type
     * @param {array} options
     * @return {Promise<SlashCommand|*>}
     */
    async addSubcommand(name, description, type = 3, options = []) {
        return new Promise(async (resolve, reject) => {
            if (name === '') {
                reject('Option Name is undefined!');
            } else if (description === '') {
                reject('Option Description is undefined!')
            }
            
            if (options.length < 1)  {
                this.options.push({
                    'name': name,
                    'description': description,
                    'type': type,
                })
            }
            else {
                this.options.push({
                    'name': name,
                    'description': description,
                    'type': type,
                    'options': options,
                })
            }
            resolve(this);
        })
    }
}

class Create extends Slash {
    constructor(client, bot_token, bot_id) {
        super(client, bot_token, bot_id)
    }

    /**
     *
     * @param {String} guild_id
     * @return {undefined}
     */
    async createCommand(guild_id = '') {
        return new Promise(async (resolve, reject) => {
            let url;
            if (guild_id === '') {
                url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
            } else {
                url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS;
            }
            if (this.request.name === '') {
                reject('Command Name is undefined ');
            } else if (this.request.description === '') {
                reject('Command Description is undefined ');
            } else {
                let json;
                if (!this.options[0]) {
                    json = this.request;
                } else {
                    json = {
                        'name': this.request.name,
                        'description': this.request.description,
                        'options': this.options
                    }
                }

                /*await axios(url, {
                    method: 'post',
                    data: JSON.parse(JSON.stringify(json)),
                    headers: {
                        'Authorization': `${this.tokenPrefix}${this.authToken}`,
                        'Content-Type': 'application/json'
                    },
                })*/

                this.client.requestHandler.request('POST', url, true, JSON.parse(JSON.stringify(json)));
            }
        })
    }
}

class Update extends Slash {
    constructor(bot_token, bot_id, command_id) {
        super(bot_token, bot_id);
        this.command_id = command_id;
    }

    /**
     *
     * @param {String} guild_id
     * @return {undefined}
     */
    async updateCommand(guild_id = '') {
        return new Promise(async (resolve, reject) => {
            let url;
            if (guild_id === '') {
                url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS + '/' + this.command_id;
            } else {
                url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS + '/' + this.command_id;
            }
            if (this.request.name === '') {
                reject('Command Name is undefined ');
            } else if (this.request.description === '') {
                reject('Command Description is undefined ');
            } else {
                let json;
                if (!this.options[0]) {
                    json = this.request;
                } else {
                    json = {
                        'name': this.request.name,
                        'description': this.request.description,
                        'options': this.options
                    }
                }

                await axios(url, {
                    method: 'patch',
                    data: JSON.parse(JSON.stringify(json)),
                    headers: {
                        'Authorization': `${this.tokenPrefix}${this.authToken}`,
                        'Content-Type': 'application/json'
                    },
                })
            }
        })
    }
}

class Delete {
    constructor(bot_token, bot_id) {
        this.tokenPrefix = 'Bot ';
        this.authToken = bot_token
        this.bot_id = bot_id;
        this.endpoints = {
            ENDPOINT: `https://discord.com/api/v9/applications/${this.bot_id}`,
            GUILD_ONLY: '/guilds/',
            COMMANDS: '/commands'
        }
    }

    /**
     *
     * @param {String} command_id
     * @param {String} guild_id
     * @return {undefined}
     */
    async deleteCommand(command_id, guild_id = '') {
        return new Promise(async (resolve) => {
            let url;
            if (guild_id === '') {
                url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
            } else {
                url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS + '/' + command_id;
            }
            
            await axios(url, {
                method: 'delete',
                data: JSON.parse(JSON.stringify(json)),
                headers: {
                    'Authorization': `${this.tokenPrefix}${this.authToken}`,
                    'Content-Type': 'application/json'
                },
            })

        })
    }
}

class GetAll {
    constructor(bot_token, bot_id, guild_id = '') {
        return new Promise(async resolve => {
            this.tokenPrefix = ('Bot') + ' ';
            this.authToken = bot_token
            this.bot_id = bot_id;
            this.endpoints = {
                ENDPOINT: `https://discord.com/api/v9/applications/${this.bot_id}`,
                GUILD_ONLY: '/guilds/',
                COMMANDS: '/commands'
            }
            let url;
            if (guild_id === '') {
                url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
            } else {
                url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS;
            }
                
            await axios(url, {
                method: 'get',
                data: JSON.parse(JSON.stringify(json)),
                headers: {
                    'Authorization': `${this.tokenPrefix}${this.authToken}`,
                    'Content-Type': 'application/json'
                },
            })
        })
    }
}

class Interaction {
    constructor(data, bot_token, bot_id) {
        this.authToken = bot_token;
        this.tokenPrefix = 'Bot ';
        this.bot_id = bot_id;
        this.endpoints = {
            CALLBACK: `https://discord.com/api/v9/interactions/${data.id}/${data.token}/callback`,
            MESSAGES: `https://discord.com/api/v9/webhooks/${this.bot_id}/${data.token}/messages/@original`,
            FOLLOWUP: `https://discord.com/api/v9/webhooks/${this.bot_id}/${data.token}`
        };
        this.packet = {
            version: data.version,
            type: data.type,
            member: data.member,
            user: data.member.user,
            interaction: {
                id: data.id,
                token: data.token,
                guild_id: data.guild_id,
                channel_id: data.channel_id,
            },
            command: {
                id: data.data.id,
                options: data.data.options,
                name: data.data.name,
                guild_id: data.guild_id,
                channel_id: data.channel_id,
            },

            /**
             * @param {String} content
             * @param {number} type
             * @return {undefined}
             */
            reply: async (content, type = 4) => {
                return new Promise(async (resolve) => {
                    const json = {
                        'type': type,
                        'data': JSON.parse(JSON.stringify(content))
                    }

                    await axios(this.endpoints.CALLBACK, {
                        method: 'post',
                        data: JSON.parse(JSON.stringify(json)),
                        headers: {
                            'Authorization': `${this.tokenPrefix}${this.authToken}`,
                            'Content-Type': 'application/json'
                        },
                    })
                })
            }
        };

        return this.packet;
    }
}

module.exports = {
    Create,
    Update,
    Delete,
    GetAll,
    Interaction,
};