class MsgCommand
{
    constructor(client, bot_id)
    {
        this.request =
        {
            'name': '',
            'type': 3
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

        if (this.request.name === '')
        {
            throw new Error('command_name is undefined.');
        }
        else
        {
            return this.client.requestHandler.request('POST', url, true, JSON.parse(JSON.stringify(this.request)));
        }
    }
}

module.exports = MsgCommand;