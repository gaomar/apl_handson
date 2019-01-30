// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const Util = require('util.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'ハローAPL';
        const pictureUrl = Util.getS3PreSignedUrl("Media/ball.png");

        // documentとdataをそれぞれ指定する
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                type : 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: "token",
                document: require('./apl_document.json'),
                datasources: {
                    "hello": {
                        "text": "ハローAPL",
                        "ballImage": pictureUrl
                    }
                }
            })            
            .getResponse();
    }
};
const HeeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HeeIntent';
    },
    handle(handlerInput) {
        const speechText = 'へぇ〜';
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                type : 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: "token",
                document: require('./apl_hee.json'),
                datasources: {
                    "hello": {
                        "hee_off": "https://github.com/gaomar/apl_handson/raw/master/files/hee_off.png",
                        "hee_on": "https://github.com/gaomar/apl_handson/raw/master/files/hee_on.png",
                        "myCount": 0
                    }
                }
            })            
            .getResponse();
    }
};
const TouchEventHandler = {
    canHandle(handlerInput) {
    return ((handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent' &&
        (handlerInput.requestEnvelope.request.source.handler === 'Press' || 
        handlerInput.requestEnvelope.request.source.handler === 'onPress')));
    },
    handle(handlerInput) {
        // セッション情報の取得
        var myCount = 0;
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        // 初期化
        if(!attributes.counter){ 
            myCount = 1;
        } else {
            myCount = attributes.counter;
            myCount++;
        }
        attributes.counter = myCount;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        const speechText = 'へぇ〜';
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDirective({
                type : 'Alexa.Presentation.APL.ExecuteCommands',
                token: "token",
                commands: [
                    {
                        type: "Sequential",
                        commands: [
                            {
                                "type": "SetPage",
                                "componentId": "myPager",
                                "position": "absolute",
                                "value": 1
                            },
                            {
                                type: "Idle",
                                delay: 500
                            },
                            {
                                "type": "SetPage",
                                "componentId": "myPager",
                                "position": "absolute",
                                "value": 0
                            }
                        ]
                    }
                ]
            }) 
            .addDirective({
                type : 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
                token: "token",
                document: require('./apl_hee.json'),
                datasources: {
                    "hello": {
                        "hee_off": "https://github.com/gaomar/apl_handson/raw/master/files/hee_off.png",
                        "hee_on": "https://github.com/gaomar/apl_handson/raw/master/files/hee_on.png",
                        "myCount": myCount
                    }
                }
            })
            .getResponse();            
    }
};
const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HeeIntentHandler,
        TouchEventHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
