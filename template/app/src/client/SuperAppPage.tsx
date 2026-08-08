import React, { useState } from "react";
import { SuperAppNav, ActiveRole } from "./SuperAppNav";
import { TicketWallet, TicketData } from "../ticketing/components/TicketWallet";
import { GateScanner } from "../ticketing/components/GateScanner";
import { ParkingDashboard } from "../parking/components/ParkingDashboard";
import { FacilityGateMonitor } from "../parking/components/FacilityGateMonitor";
import { LiveTrackingMap } from "../transit/components/LiveTrackingMap";
import { DriverTerminal } from "../transit/components/DriverTerminal";
import { SeatOrderModal } from "../concessions/components/SeatOrderModal";
import { RunnerDispatch } from "../concessions/components/RunnerDispatch";
import { TicketTransferModal } from "../ticketing/components/TicketTransferModal";

export function SuperAppPage() {
  const [activeRole, setActiveRole] = useState<ActiveRole>("ATTENDEE");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [concessionTargetTicket, setConcessionTargetTicket] = useState<TicketData | null>(null);
  const [transferTargetTicket, setTransferTargetTicket] = useState<TicketData | null>(null);
  const [showGateMonitor, setShowGateMonitor] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      <SuperAppNav
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Attendee / Passenger View */}
        {activeRole === "ATTENDEE" && (
          <div className="space-y-8">
            <TicketWallet
              isOffline={isOffline}
              onOpenConcessions={(tkt) => setConcessionTargetTicket(tkt)}
              onOpenTransfer={(tkt) => setTransferTargetTicket(tkt)}
            />

            {concessionTargetTicket && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
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
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
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
            <ParkingDashboard onOpenGateMonitor={() => setShowGateMonitor(!showGateMonitor)} />
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
