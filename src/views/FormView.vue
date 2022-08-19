<template>
    <v-container
        class="form"
    >

      <div class="form-title">{{title}}</div>

      <v-form
        ref="form"
        class="build-context"
        lazy-validation
        v-model="formValid"
        >
        <v-container
            v-for="[index, [attribute]] of Object.entries(Object.entries(form))"
            class="form-content"
            v-bind:key="index+attribute"
            v-bind:class="{'full-width': form[attribute].fullSize ===true, 'half-width': form[attribute].fullSize ===false}"
        >

          <v-text-field
              v-if="form[attribute].type === 'string'"
              :label="form[attribute].label"
              v-model="form[attribute].value"
              :rules="form[attribute].rules"
          >
          </v-text-field>

          <v-container
              v-if="form[attribute].type === 'radio'"
              class="form-radio pa-0"
              v-bind:class="{'full-width': form[attribute].fullSize ===true, 'half-width': form[attribute].fullSize ===false}"
          >
            <v-radio-group
                v-model="form[attribute].value"
                :column="!form[attribute].horizontal"
                :row="form[attribute].horizontal"
                :rules="form[attribute].rules"
            >
              <v-radio
                  v-for=" radio in form[attribute].radios"
                  v-bind:key="radio.label"
                  :label="radio.label"
                  :value="radio.value"
              >
              </v-radio>
            </v-radio-group>
          </v-container>

          <v-container
              v-if="form[attribute].type === 'checkbox'"
              class="form-checkbox pa-0"
              v-bind:class="{'full-width': form[attribute].fullSize ===true, 'half-width': form[attribute].fullSize ===false}"
          >
            <v-row
                class="form-checkbox-row"
            >
              <v-checkbox
                  v-for=" checkbox in form[attribute].checkboxes"
                  v-model="form[attribute].value"
                  v-bind:key="checkbox.label"
                  :label="checkbox.label"
                  :value="checkbox.value"
              ></v-checkbox>
            </v-row>

          </v-container>

          <v-container
              v-if="form[attribute].type === 'date'"
              v-bind:class="{'full-width': form[attribute].fullSize ===true}"
              class="form-date pa-0"
          >
            <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="form[attribute].value"
                    :label="form[attribute].label"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="form[attribute].rules"
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                  v-model="form[attribute].value"
                  @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-container>

          <v-select
              v-if="form[attribute].type === 'select'"
              v-bind:class="{'full-width': form[attribute].fullSize ===true}"
              :rules="form[attribute].rules"
              v-model="form[attribute].value"
              :hint="`${form[attribute].value.country}, ${form[attribute].value.abbr}`"
              :items="form[attribute].items"
              item-text="country"
              item-value="abbr"
              label="Select"
              :persistent-hint="form[attribute].persistentHint"
              :return-object="form[attribute].returnObject"
              :single-line="form[attribute].singleLine"
          ></v-select>

          <v-textarea
              v-if="form[attribute].type === 'textarea'"
              v-bind:class="{'full-width': form[attribute].fullSize ===true}"
              :label="form[attribute].label"
              v-model="form[attribute].value"
              :rules="form[attribute].rules"
              :filled="form[attribute].filled"
              :shaped="form[attribute].shaped"
              :rows="form[attribute].rows"
              :auto-grow="form[attribute].autoGrow"
              :row-height="form[attribute].rowHeight"
              :outlined="form[attribute].outlined"
          ></v-textarea>

        </v-container>

        <div
            v-if="automaticSpacer"
            class="extra-spacer"
        >&nbsp;</div>

        <div
            v-for="[index, [attribute]] of Object.entries(Object.entries(files.value))"
            class="form-content"
            v-bind:class="{'full-width': files.value[attribute].fullSize ===true, 'half-width': files.value[attribute].fullSize ===false}"
            v-bind:key="attribute+index"
        >
          <v-file-input
              v-model="files.value[attribute].value"
              :multiple="files.value[attribute].multiple"
              :chips="files.value[attribute].chips"
              :small-chips="files.value[attribute].smallChips"
              :rules="files.value[attribute].rules"
              :label="files.value[attribute].label"
              :accept="files.value[attribute].accept"
              :placeholder="files.value[attribute].placeholder"
          ></v-file-input>

        </div>

      </v-form>

      <v-row
          class="form-buttons"
          align="center"
          justify="end"
      >
        <v-btn
            depressed
            @click="reset"
        >
          {{$t('Clean')}}
        </v-btn>
        <v-btn
            depressed
            :disabled="uploading"
            color="primary"
            @click="sendForm"
        >
          {{$t('Send')}}
        </v-btn>
      </v-row>

      <v-snackbar
          v-model="successSnackbar"
          :multi-line="false"
      >
        {{ $t('FormSaveSuccessfully') }}

        <template v-slot:action="{ attrs }">
          <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="successSnackbar = false"
          >
            {{ $t('Close') }}
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar
          v-model="errorSnackbar"
          :multi-line="true"
      >
        {{ $t('FormSaveError') }}

        <template v-slot:action="{ attrs }">
          <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="errorSnackbar = false"
          >
            {{ $t('Close') }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>

</template>

<style scoped lang="scss">
.form{
  overflow: scroll;
  overflow-x: hidden;
  height: calc(100vh - 48px);
  .form-title{
    font-size: 2rem;
    font-weight: bold;
    color: #000;
  }
  .build-context{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .extra-spacer{
      flex: 1;
      width: 100%;
      height: 100%;
    }

    .form-content{
      padding: 0 12px;
      margin-bottom: 1rem;

      .form-checkbox-row{
        padding: 0 12px;
      }
    }
    .full-width{
      width: 100%;
    }
    .half-width{
      width: 50%;
      margin-left: inherit;
    }
    .form-buttons{
      padding: 0 12px;

    }
  }
}

</style>

<script>
import _ from 'lodash';
import Repository from "@/repositories/RepositoryFactory";
const FormRepository = Repository.get("FormRepository");
const FormDocumentsRepository = Repository.get("FormDocumentsRepository");

export default {
  name: 'HomeView',

  components: {

  },
  computed:{

    lastKey(){
      return Object.keys(this.form).pop();
    },

    formValues(){
      let formValues = {};

      for(let [key, value] of Object.entries(this.form))
        formValues[key] = value.value;

      return formValues;
    },

    automaticSpacer(){
      let fullSizeObjects = _.filter(this.form, (value) => value.fullSize === true);
      let fullSizeObjectsCount = fullSizeObjects.length;
      let modCountValue = Object.keys(this.form).length - fullSizeObjectsCount;

      return (modCountValue % 2 === 1) && this.form[this.lastKey].fullSize === false;
    }

  },
  data() {
    return {
      title:process.env.VUE_APP_TITLE_EXAMPLE,

      form:{
        name:{
          type: 'string',
          label: this.$t('Name'),
          value: '',
          rules:[
            value => !!value || this.$t('Required'),
          ],
          fullSize: false,
        },

        last_name:{
          type: 'string',
          label: this.$t('LastName'),
          value: '',
          rules:[
            value => !!value || this.$t('Required'),
          ],
          fullSize:false
        },

        identity_document:{
          type: 'string',
          label: this.$t('IdentityDocument'),
          value: '',
          rules:[value => !!value || this.$t('Required'),],
          fullSize:false
        },

        email:{
          type: 'string',
          label: this.$t('Email'),
          value: '',
          rules:[
            value => !!value || this.$t('Required'),
            value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || this.$t('InvalidEmail')
            },
          ],
          fullSize:false
        },

        marital_status:{
          type:'radio',
          horizontal:true,
          value:null,
          fullSize:true,
          rules:[value => !!value || this.$t('Required'),],
          radios:[
            {
              value: 'Married',
              label: this.$t('Married'),
            },
            {
              value: 'Single',
              label: this.$t('Single'),
            },
            {
              value: 'Divorced',
              label: this.$t('Divorced'),
            },
            {
              value: 'Widowed',
              label: this.$t('Widowed'),
            },
          ],
        },

        online_formation:{
          type:'checkbox',
          value:[],
          fullSize:true,
          horizontal:true,

          checkboxes:[
            {
              value: 'EducationOnlineCourse',
              label: this.$t('EducationOnlineCourse'),
            },
            {
              value: 'WorkOnlineCourse',
              label: this.$t('WorkOnlineCourse'),
            },
            {
              value: 'SecondLanguageOnlineCourse',
              label: this.$t('SecondLanguageOnlineCourse'),
            }
          ],
        },

        birth_date:{
          type:'date',
          label: this.$t('ChooseBirthDate'),
          value: '',
          rules:[
            value => !!value || this.$t('Required'),
          ],
          fullSize:false
        },

        birth_place:{
          type: 'select',
          label: this.$t('BirthPlace'),
          value: {country:"Ecuador", abbr:"EC"},
          persistentHint:true,
          returnObject:false,
          singleLine:true,
          rules:[
            value => !!value || this.$t('Required'),
          ],
          items:[
            {country:"Ecuador", abbr:"EC"},
            {country:"Peru", abbr:"PE"},
            {country:"Colombia", abbr:"CO"},
            {country:"Bolivia", abbr:"BO"}
          ],
          fullSize:false
        },

        comments:{
          type: 'textarea',
          label: this.$t('Comments'),
          value: '',
          shaped:true,
          filled:false,
          autoGrow:true,
          outlined:true,
          rows:3,
          rowHeight:10,
          rules:[
            value => !!value || this.$t('Required'),
          ],
          fullSize:false
        },

      },

      files:{
        type: 'files',
        value: {
          IDENTITY_DOCUMENT: {
            label: this.$t('IdentityDocuments'),
            multiple: true,
            chips: true,
            smallChips: true,
            accept: 'image/png, image/jpeg, image/bmp',
            placeholder: this.$t('PickFile'),
            rules:[],
            value:[],
            fullSize:false
          },
          DEGREE: {
            label: this.$t('Degree'),
            chips: true,
            smallChips: true,
            multiple: false,
            accept: 'image/png, image/jpeg, image/bmp',
            placeholder: this.$t('PickFile'),
            rules:[],
            value:[],
            fullSize:false
          },
        } ,
      },

      menu:false,
      formValid:false,

      successSnackbar:false,
      errorSnackbar:false,

      uploading:false,

    }
  },

  methods:{
    validate () {
      return this.$refs.form.validate()
    },

    reset () {
      this.$refs.form.resetValidation()
      for(let [key] of Object.entries(this.form)){

        if(this.form[key].type ==='select'){
          this.form[key].value = this.form[key].items[0];
          continue;
        }

        Array.isArray(this.form[key].value)
            ? this.form[key].value = []
            : this.form[key].value = '';

      }
    },

    postFormData(){
      FormRepository.postForm(process.env.VUE_APP_POST_URL,this.formValues)
          .then(() => {
            this.successSnackbar = true;
            this.reset();
          })
          .catch(() => {
            this.errorSnackbar = true;
          });
    },

    async postFormDocuments() {
      const formData = new FormData();
      let position = 0;
      let valid = false;

      for (let [key, typeObject] of Object.entries(this.files.value)) {

        let documents = typeObject.value;

        if (typeObject.value.length > 0) {
          valid = true

          formData.append(`documents[${position}][type]`, key);
        }

        for (let i = 0; i < documents.length; i++) {

          let files = _.map(documents, (files) => files.file);

          formData.append(`documents[${position}][files][${i}]`, files[i]);
        }

        position += 1;
      }

      if (valid) {
        await FormDocumentsRepository.postDocument(
            process.env.VUE_APP_POST_DOCUMENTS_URL,
            formData,
            {'Content-Type': `multipart/form-data`,}
        ).then(() => {
          this.successSnackbar = true;
          this.reset();
        })
        .catch(() => {
          this.errorSnackbar = true;
        });
      }
    },

    async sendForm() {
      this.uploading = true;
      if (this.validate()) {
        this.postFormData();
        await this.postFormDocuments();
      }
      this.uploading = false;
    }
  }
}
</script>
