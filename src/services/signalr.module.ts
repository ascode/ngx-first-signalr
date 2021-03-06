import { NgModule, ModuleWithProviders, NgZone, OpaqueToken } from '@angular/core';
import { SignalR } from './signalr';
import { SignalRConfiguration } from './signalr.configuration';

const SIGNALR_CONFIGURATION = new OpaqueToken('SIGNALR_CONFIGURATION');
export const SIGNALR_JCONNECTION_TOKEN = new OpaqueToken('SIGNALR_JCONNECTION_TOKEN');

export function createSignalr(configuration: SignalRConfiguration, zone: NgZone) {

    let jConnectionFn = getJConnectionFn();

    return new SignalR(configuration, zone, jConnectionFn);
}

export function getJConnectionFn(): any {
    let jQuery = getJquery();
    let hubConnectionFn = (<any>window).jQuery.hubConnection;
    if (hubConnectionFn == null) {
        throw new Error('Signalr failed to initialize. Script \'jquery.signalR.js\' is missing. Please make sure to include \'jquery.signalR.js\' script.');
    }
    return hubConnectionFn;
}

function getJquery(): any {
    let jQuery = (<any>window).jQuery;
    if (jQuery == null) {
        throw new Error('Signalr failed to initialize. Script \'jquery.js\' is missing. Please make sure to include jquery script.');
    }
    return jQuery;
}

@NgModule({
    providers: [{
        provide: SignalR,
        useValue: SignalR
    }]
})
export class SignalRModule {
    public static forRoot(getSignalRConfiguration: Function): ModuleWithProviders {
        return {
            ngModule: SignalRModule,
            providers: [
                {
                    provide: SIGNALR_JCONNECTION_TOKEN,
                    useFactory: getJConnectionFn
                },
                {
                    provide: SIGNALR_CONFIGURATION,
                    useFactory: getSignalRConfiguration
                },
                {
                    deps: [SIGNALR_JCONNECTION_TOKEN, SIGNALR_CONFIGURATION, NgZone],
                    provide: SignalR,
                    useFactory: (createSignalr)
                }
            ],
        };
    }
    public static forChild(): ModuleWithProviders {
        throw new Error("forChild method not implemented");
    }
}
