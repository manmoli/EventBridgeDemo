import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class EventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eventLambda = new cdk.aws_lambda.Function(this, 'EventLambdaHandlerFunction', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      code: cdk.aws_lambda.Code.fromInline(`
          exports.handler = async (event) =>{
            console.log('Event received: ', event)
            return {}
          }        
        `),
      handler: 'index.handler'

    })

    const customEventBus = new cdk.aws_events.EventBus(this, 'CustomEventBus', {
      eventBusName: 'MyCustomBus'
    })

    const rule = new cdk.aws_events.Rule(this, 'EventLambdaHandlerRule', {
      eventPattern: {
        source: ['custom.ecommerce'],
        detailType: ['OrderPlaced'],
      },
      eventBus: customEventBus
    })

    rule.addTarget(new cdk.aws_events_targets.LambdaFunction(eventLambda))

    new cdk.CfnOutput(this, 'EventBridgeBusArn', {
      value: customEventBus.eventBusArn
    })
  }
}
