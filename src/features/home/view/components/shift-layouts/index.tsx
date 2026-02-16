import { ShiftIdle } from '../layouts/shift-idle/shift-idle.component';
import { ShiftStarted } from '../layouts/shift-started/shift-started.component';
import { ShiftPaused } from '../layouts/shift-paused/shift-paused.component';
import { ShiftResumed } from '../layouts/shift-resumed/shift-resumed.component';
import { ShiftFinished } from '../layouts/shift-finished/shift-finished.component';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { User } from '../../../model';

interface ShiftLayoutsProps {
  status: ShiftStatus;
  user: User | null;
  zone: Zone | null;
  finalizeShift: WebhookShift | null;
  shiftVM: {
    setShiftId: (id: string) => void;
    changeStatus: (status: ShiftStatus) => void;
    resetToIdle: () => void;
    setZone: (zone: Zone | null) => void;
    startShift: (zone: Zone | null) => void;
    startingShift: boolean;
  };
  onOpenModal: () => void;
}

export const ShiftLayouts = ({ 
  status, 
  user, 
  zone, 
  finalizeShift, 
  shiftVM,
  onOpenModal 
}: ShiftLayoutsProps) => {
  switch (status) {
    case ShiftStatus.IDLE:
      return (
        <ShiftIdle 
          zone={zone}
          setZone={shiftVM.setZone}
          onStartShift={() => shiftVM.startShift(zone)}
          isStarting={shiftVM.startingShift}
        />
      );
    
    case ShiftStatus.STARTED:
      return (
        <ShiftStarted 
          setIsOpen={onOpenModal}
          setState={shiftVM.changeStatus}
          user={user}
        />
      );
    
    case ShiftStatus.PAUSED:
      return (
        <ShiftPaused 
          setIsOpen={onOpenModal}
          setState={shiftVM.changeStatus}
          user={user}
        />
      );
    
    case ShiftStatus.RESUMED:
      return (
        <ShiftResumed 
          setIsOpen={onOpenModal}
          setState={shiftVM.changeStatus}
          user={user}
        />
      );
    
    case ShiftStatus.FINISHED:
      return finalizeShift ? (
        <ShiftFinished 
          setIsOpen={onOpenModal}
          onReset={shiftVM.resetToIdle}
          finalize_shift={finalizeShift}
          state={status}
          user={user}
        />
      ) : null;
    
    default:
      return null;
  }
};
