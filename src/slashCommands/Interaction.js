class Interaction
{
    constructor(client, data)
    {
        this.endpoints =
        {
            CALLBACK: `/interactions/${data.id}/${data.token}/callback`,
            WEBHOOK: `/webhooks/${data.id}/{data.token}/messages/@original`,
        };
        this.client = client;
        this.packet;

        const response = {
            'type': 5,
        }

        // ACK an interaction and edit a response later, the user sees a loading state
        this.client.requestHandler.request('POST', this.endpoints.CALLBACK, true, JSON.parse(JSON.stringify(response))).catch(err => console.error(err));
        
        switch(data.type)
        {
            case 1:
                this.packet = data;
                break;
            case 2:
                this.packet = Object.assign({}, data,
                {
                    reply: async (content, type = 4) =>
                    {
                        const json = {
                            'type': type,
                            'data': JSON.parse(JSON.stringify(content))
                        }
            
                        // respond to an interaction with a message
                        this.client.requestHandler.request('PATCH', this.endpoints.WEBHOOK, true, JSON.parse(JSON.stringify(json))).catch(err => console.error(err));
                    }
                });
                break;
        }

        return this.packet;
    }
}

module.exports = Interaction;
