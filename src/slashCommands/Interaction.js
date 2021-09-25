class Interaction
{
    constructor(client, data)
    {
        this.endpoints =
        {
            CALLBACK: `/interactions/${data.id}/${data.token}/callback`,
        };
        this.client = client;
        this.packet;

        if (data.type === 1)
        {
            this.packet = data;
        }
        else if (data.type === 2)
        {
            this.packet = Object.assign({}, data,
            {
                reply: async (content, type = 4) =>
                {
                    const json = {
                        'type': type,
                        'data': JSON.parse(JSON.stringify(content))
                    }
    
                    return this.client.requestHandler.request('POST', this.endpoints.CALLBACK, true, JSON.parse(JSON.stringify(json)));
                }
            });
        }

        return this.packet;
    }
}

module.exports = Interaction;
