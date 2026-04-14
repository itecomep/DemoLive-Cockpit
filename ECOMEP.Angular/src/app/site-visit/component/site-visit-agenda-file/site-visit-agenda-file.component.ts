import { Component, Input, OnInit } from "@angular/core";
import { McvFileComponent } from "src/app/mcv-file/components/mcv-file/mcv-file.component";
import { McvFileExtensionPipe } from "../../../mcv-file/pipes/mcv-file-extension.pipe";
import { McvFileSizePipe } from "../../../mcv-file/pipes/mcv-file-size.pipe";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { NgClass, NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "site-visit-agenda-file",
    templateUrl: "./site-visit-agenda-file.component.html",
    styleUrls: ["./site-visit-agenda-file.component.scss"],
    standalone: true,
    imports: [
        NgClass,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NgIf,
        MatTooltipModule,
        MatProgressBarModule,
        AsyncPipe,
        McvFileSizePipe,
        McvFileExtensionPipe,
    ],
})
export class SitevisitAgendaFileComponent extends McvFileComponent
{
  pdf = "application/pdf";
  excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  constructor()
  {
    super();
  }
}
