import { Pet } from "./pet";
import { ServiceHistory } from "./serviceHistory";
import { User } from "./user";

export interface Scheduling {
    dateInitial: string;
    dateEnd: string;
    description: string;
    serviceId: string;
    serviceHistory: ServiceHistory;
    petId: string;
    pet: Pet;
    userId: string;
    user: User;
    attendenceId: string;
    attendance: AttendanceVm;
  }
  
  export interface AttendanceVm {
    description: string;
    data: string;
    prescription: string;
    agentId: string | null;
    appointmentId: string;
    schedulingId: string;
    scheduling: Scheduling;
    attendanceStatus: number;
  }