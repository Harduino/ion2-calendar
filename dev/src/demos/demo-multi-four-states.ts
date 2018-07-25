import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { CalendarComponentOptions } from '../ion2-calendar'

@Component({
	selector: 'demo-multi-four-states',
	template: `
		<hr>
		<h3 style="text-align: center;">multi</h3>
		<ion-calendar [(ngModel)]="date"
			(onChange)="onChange($event)"
			[options]="options"
			type="string"
			format="YYYY-MM-DD">
		</ion-calendar>
	`
})
export class DemoMultiFourStatesComponent {

	// date: string[] = ['2018-01-01', '2018-01-02', '2018-01-05'];
	date = {};

	options: CalendarComponentOptions = {
		from: new Date(2000, 0, 1),
		pickMode: 'multi4'
	};

	constructor(public modalCtrl: ModalController) {
		this.date = {
			'2018-07-01': {
				state: 'dinner',
				confirm: 'confirmed'
			},
			'2018-07-02': {
				state: 'lunch',
				confirm: 'unconfirmed'
			},
			'2018-07-05': {
				state: 'all',
				confirm: 'confirmed'
			}
		}
	}

	onChange($event) {
		console.log('selected',$event);
	}
}
