class Slash
{
    constructor(client, bot_token, bot_id)
    {
        this.request =
        {
            'name': '',
            'description': ''
        };
        this.options = [];
        this.tokenPrefix = 'Bot ';
        this.authToken = bot_token
        this.bot_id = bot_id;
        this.endpoints =
        {
            ENDPOINT: `/applications/${this.bot_id}`,
            GUILD_ONLY: '/guilds/',
            COMMANDS: '/commands',
        };
        this.client = client;
    }

    async setCommandName(name)
    {
        this.request.name = name;
    }

    async setCommandDescription(description)
    {
        this.request.description = description;
    }

    async addOption(name, description, required = true, type = 3, choices = [])
    {
        if (name === '')
        {
            return 'Option Name is undefined!';
        }
        else if (description === '')
        {
            return 'Option Description is undefined!';
        }
            
        if (choices.length >= 1)
        {
            this.options.push({
                'name': name,
                'description': description,
                'type': type,
                'required': required,
                'choices': choices
            })
        }
        else
        {
            this.options.push({
                'name': name,
                'description': description,
                'type': type,
                'required': required,
            });
        }
    }

    async addSubcommand(name, description, type = 3, options = [])
    {
        if (name === '')
        {
            return 'Option Name is undefined!';
        }
        else if (description === '')
        {
            return 'Option Description is undefined!';
        }
            
        if (options.length < 1)
        {
            this.options.push({
                'name': name,
                'description': description,
                'type': type,
            });
        }
        else
        {
            this.options.push({
                'name': name,
                'description': description,
                'type': type,
                'options': options,
            });
        }
    }
}

class Create extends Slash
{
    constructor(client, bot_token, bot_id)
    {
        super(client, bot_token, bot_id)
    }

    async createCommand(guild_id = '')
    {
        let url;
        if (guild_id === '')
        {
            url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
        }
        else
        {
            url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS;
        }

        if (this.request.name === '')
        {
            return 'Command Name is undefined ';
        }
        else if (this.request.description === '')
        {
            return 'Command Description is undefined ';
        }
        else
        {
            let json;
            if (!this.options[0])
            {
                json = this.request;
            }
            else
            {
                json = {
                    'name': this.request.name,
                    'description': this.request.description,
                    'options': this.options
                }
            }

            this.client.requestHandler.request('POST', url, true, JSON.parse(JSON.stringify(json)));
        }
    }
}

class Update extends Slash
{
    constructor(client, bot_token, bot_id, command_id)
    {
        super(client, bot_token, bot_id);
        this.command_id = command_id;
    }

    async updateCommand(guild_id = '')
    {
        let url;
        if (guild_id === '')
        {
            url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS + '/' + this.command_id;
        }
        else
        {
            url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS + '/' + this.command_id;
        }

        if (this.request.name === '')
        {
            return 'Command Name is undefined';
        }
        else if (this.request.description === '')
        {
            return 'Command Description is undefined';
        }
        else
        {
            let json;
            if (!this.options[0])
            {
                json = this.request;
            }
            else
            {
                json = {
                    'name': this.request.name,
                    'description': this.request.description,
                    'options': this.options
                }
            }

            this.client.requestHandler.request('PATCH', url, true, JSON.parse(JSON.stringify(json)));
        }
    }
}

class Delete
{
    constructor(client, bot_token, bot_id)
    {
        this.tokenPrefix = 'Bot ';
        this.authToken = bot_token
        this.bot_id = bot_id;
        this.client = client;
        this.endpoints =
        {
            ENDPOINT: `/applications/${this.bot_id}`,
            GUILD_ONLY: '/guilds/',
            COMMANDS: '/commands'
        }
    }

    async deleteCommand(command_id, guild_id = '')
    {
        let url;
        if (guild_id === '')
        {
            url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
        }
        else
        {
            url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS + '/' + command_id;
        }

        this.client.requestHandler.request('DELETE', url, true);
    }
}

class GetAll
{
    constructor(client, bot_token, bot_id, guild_id = '')
    {
        this.tokenPrefix = 'Bot ';
        this.authToken = bot_token
        this.bot_id = bot_id;
        this.client = client;
        this.endpoints =
        {
            ENDPOINT: `/applications/${this.bot_id}`,
            GUILD_ONLY: '/guilds/',
            COMMANDS: '/commands'
        };
        this.guild_id = guild_id;
    }

    async getCommands()
    {
        let url;
        if (this.guild_id === '')
        {
            url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
        }
        else
        {
            url = this.endpoints.ENDPOINT + this.endpoints.GUILD_ONLY + guild_id + this.endpoints.COMMANDS;
        }

        this.client.requestHandler.request('GET', url, true, JSON.parse(JSON.stringify(json)));
    }
}

class Interaction
{
    constructor(client, data, bot_token, bot_id)
    {
        this.authToken = bot_token;
        this.tokenPrefix = 'Bot ';
        this.bot_id = bot_id;
        this.endpoints =
        {
            CALLBACK: `/interactions/${data.id}/${data.token}/callback`,
        };
        this.client = client;

        this.packet = Object.assign({}, data,
            {
                reply: async (content, type = 4) =>
                {
                    const json = {
                        'type': type,
                        'data': JSON.parse(JSON.stringify(content))
                    }

                    this.client.requestHandler.request('POST', this.endpoints.CALLBACK, true, JSON.parse(JSON.stringify(json)));
                }
        });

        return this.packet;
    }
}

module.exports =
{
    Create,
    Update,
    Delete,
    GetAll,
    Interaction,
};