// import { TMA } from "../value-objects/TMA";
// import { NS } from "../value-objects/NS";
// import { CallEvent } from "../events/CallEvent";
//
// export class Queue {
//     private id: string;
//     private callsInProgress: number = 0;
//     private callsAnswered: number = 0;
//     private callsMissed: number = 0;
//     private tma: TMA;
//     private ns: NS;
//
//     constructor(id: string) {
//         this.id = id;
//         this.tma = new TMA(0);
//         this.ns = new NS();
//     }
//
//     handleCallEvent(event: CallEvent): void {
//         switch (event.getEventType()) {
//             case "ENTRAURA":
//                 this.callsInProgress++;
//                 break;
//             case "ATENDIMENTO":
//                 this.callsAnswered++;
//                 this.callsInProgress--;
//                 this.tma.update(event.getCallDuration());
//                 break;
//             case "FIMCHAMADA":
//                 if (event.isMissed()) {
//                     this.callsMissed++;
//                 }
//                 this.callsInProgress--;
//                 break;
//         }
//     }
//
//     getMetrics(): object {
//         return {
//             inProgress: this.callsInProgress,
//             answered: this.callsAnswered,
//             missed: this.callsMissed,
//             tma: this.tma.getValue(),
//             ns: this.ns.calculate(this.callsAnswered, this.callsMissed)
//         };
//     }
// }
