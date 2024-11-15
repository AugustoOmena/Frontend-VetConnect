import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { EUserType } from "../../shared/Enums/eusertype";
import { User } from "../../shared/models/user";

@Injectable({
    providedIn: 'root'
  })
  export class AppService {
    private _sessionUser!: User;

    public get sessionUser(): User {
      if (!this._sessionUser) {
        let jsonUserData = localStorage.getItem(environment.localStore.user);
        console.log('O valor armazenado do app é ', jsonUserData)

        this._sessionUser = jsonUserData ? JSON.parse(jsonUserData) : null;
      }
      return this._sessionUser;
    }

    validateProfile(profiles: EUserType[]): boolean {
        if (this.sessionUser == null) return false;
        return profiles.indexOf(this.sessionUser.userType) >= 0;
      }

      sessionUserEvent = new EventEmitter<User>();

      storeUser(sessionUser: User) {
        this._sessionUser = sessionUser;
        this.sessionUserEvent.next(sessionUser);
        localStorage.setItem(environment.localStore.user, JSON.stringify(sessionUser));
      }
  }  