import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITest> = [];
  nameParams = '';
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
      this.tests = tests;
    } else {
      this.tests = await this.loadGradesDataFromJason();
    }
  }

  async loadGradesDataFromJason() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  addTest() {
    const testForm: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null,
    };
    this.tests.unshift(testForm);
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  saveTest() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
    this.toastService.showToast('success', 2000, 'Success: Items saved!');
  }

  // convertString() {
  //   let convertPp = 0;
  //   // let convertPf = 0;
  //   convertPp = parseFloat(localStorage.getItem('tests'));
  //   // convertPf = parseFloat(localStorage.getItem('pointsReceived'));
  // }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveTest();
  }

  compute() {
    if (this.nameParams == null || this.nameParams === '') {
      this.toastService.showToast('warning', 2000, 'Name must not be null');
    } else if (this.nameParams.indexOf(', ') === -1) {
      this.toastService.showToast('warning', 2000, 'Name must contain a comma and a space');
    } else {
    const data = this.calculateGrade();
     this.calculateGrade();
     this.router.navigate(['home', data]);
    }

  }

  calculateGrade() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    let percentage = 0.00;
    console.log('Pre calculation grade percentage-->', percentage.toFixed(2));
    let grade = '';
    let firstName, lastName, indexOfComma, fullName;
    indexOfComma = this.nameParams.indexOf(', ');
    firstName = this.nameParams.slice(indexOfComma + 1, this.nameParams.length);
    lastName = this.nameParams.slice(0, indexOfComma);
    fullName = firstName + ' ' + lastName;
    for (let i = 0, length = this.tests.length; i < length; i++) {
      console.log('i-------->', i, 'this.tests[i]', this.tests[i]);
      const testinput = this.tests[i];
      // this.convertString();
      pointsReceived += testinput.pointsReceived;
      pointsPossible +=  testinput.pointsPossible;
    }
    console.log('Possible Points--->', pointsPossible, 'Points Received--->', pointsReceived);
    percentage = pointsReceived / pointsPossible;
    grade = this.computeGrade(percentage * 100);
    console.log('Percentage-->', percentage.toFixed(2), 'Letter Grade-->', grade, 'First Name-->', firstName, 'Last Name-->', lastName);
    return {
      pointsPossible,
      pointsReceived,
      fullName,
      percentage: (pointsReceived / pointsPossible).toFixed(2),
      grade
    };

  }

  computeGrade(percentage: number) {
    let grade = '';
    switch (true) {
      case percentage >= 90:
        grade = 'A';
        break;
      case percentage >= 80:
        grade = 'B';
        break;
      case percentage >= 70:
        grade = 'C';
        break;
      case percentage >= 60:
        grade = 'D';
        break;
      default:
        grade = 'F';
        break;
    }
    return grade;
  }


}
