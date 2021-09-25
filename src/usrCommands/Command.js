class UsrCommand
{
    constructor(client, bot_id)
    {
        this.request =
        {
            'name': '',
            'type': 2
        };
        this.endpoints =
        {
            ENDPOINT: `/applications/${bot_id}`,
            COMMANDS: '/commands',
        };
        this.client = client;
    }

    async setCommandName(name)
    {
        this.request.name = name;
    }

    async createCommand()
    {
        const url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS;
        let json;

        if (this.request.name === '')
        {
            throw new Error('command_name is undefined.');
        }
        else
        {
            json = this.request;
            return this.client.requestHandler.request('POST', url, true, JSON.parse(JSON.stringify(json)));
        }
    }

    async deleteCommand(command_id)
    {
        const url = this.endpoints.ENDPOINT + this.endpoints.COMMANDS + '/' + command_id;

        return this.client.requestHandler.request('DELETE', url, true);
    }
}

module.exports = UsrCommand;