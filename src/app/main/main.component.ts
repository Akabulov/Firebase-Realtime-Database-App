import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage, AngularFireStorageModule } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { FirebaseService } from '../services/firebase.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  selectedImage: any = null;
  id: string;
  url: string;
  file: string;

  constructor(@Inject(AngularFireStorage) private storage: AngularFireStorage, @Inject(FirebaseService) private fs: FirebaseService) { }

  ngOnInit(): void {
    this.fs.getImageDetailList();
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }

  save() {
    var name = this.selectedImage.name;
    const fileRef = this.storage.ref(name);

    this.storage.upload(name, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.url = url;

          this.fs.insertImageDetails(this.id, this.url);
            alert('Загрузка успешна');
        })
      })
    ).subscribe();
  }

  view() {
    this.fs.getImage(this.file);
  }

}
