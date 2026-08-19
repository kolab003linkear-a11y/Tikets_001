import { useState } from "react";
import { RunnerDispatch } from "../concessions/components/RunnerDispatch";
import { SeatOrderModal } from "../concessions/components/SeatOrderModal";
import { FacilityGateMonitor } from "../parking/components/FacilityGateMonitor";
import { ParkingDashboard } from "../parking/components/ParkingDashboard";
import { GateScanner } from "../ticketing/components/GateScanner";
import { TicketTransferModal } from "../ticketing/components/TicketTransferModal";
import { TicketData, TicketWallet } from "../ticketing/components/TicketWallet";
import { DriverTerminal } from "../transit/components/DriverTerminal";
import { LiveTrackingMap } from "../transit/components/LiveTrackingMap";
import { ActiveRole, SuperAppNav } from "./SuperAppNav";

export function SuperAppPage() {
  const [activeRole, setActiveRole] = useState<ActiveRole>("ATTENDEE");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [concessionTargetTicket, setConcessionTargetTicket] =
    useState<TicketData | null>(null);
  const [transferTargetTicket, setTransferTargetTicket] =
    useState<TicketData | null>(null);
  const [showGateMonitor, setShowGateMonitor] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      <SuperAppNav
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Attendee / Passenger View */}
        {activeRole === "ATTENDEE" && (
          <div className="space-y-8">
            <TicketWallet
              isOffline={isOffline}
              onOpenConcessions={(tkt) => setConcessionTargetTicket(tkt)}
              onOpenTransfer={(tkt) => setTransferTargetTicket(tkt)}
            />

            {concessionTargetTicket && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                <div className="w-full max-w-lg">
                  <SeatOrderModal
                    ticketZone={concessionTargetTicket.zone}
                    ticketRow={concessionTargetTicket.row}
                    ticketSeat={concessionTargetTicket.seatNumber}
                    onClose={() => setConcessionTargetTicket(null)}
                  />
                </div>
              </div>
            )}

            {transferTargetTicket && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
                <div className="w-full max-w-lg">
                  <TicketTransferModal
                    ticket={transferTargetTicket}
                    onClose={() => setTransferTargetTicket(null)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Driver Parking View */}
        {activeRole === "DRIVER" && (
          <div className="space-y-8">
            <ParkingDashboard
              onOpenGateMonitor={() => setShowGateMonitor(!showGateMonitor)}
            />
            {showGateMonitor && <FacilityGateMonitor />}
          </div>
        )}

        {/* Transit Driver / Passenger GPS View */}
        {activeRole === "TRANSIT_DRIVER" && (
          <div className="space-y-8">
            <LiveTrackingMap />
            <DriverTerminal />
          </div>
        )}

        {/* Gate Staff Scanner View */}
        {activeRole === "GATE_STAFF" && (
          <div className="space-y-8">
            <GateScanner />
          </div>
        )}

        {/* Concession Runner View */}
        {activeRole === "RUNNER" && (
          <div className="space-y-8">
            <RunnerDispatch />
          </div>
        )}
      </main>
    </div>
  );
}
