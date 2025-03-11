// ~/store/travelInsuranceStore.js

import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useTravelInsuranceStore = defineStore('travelInsurance', {
    state: () => ({
        // 受益人相關欄位
        form: {
            insuranceNumber: '',
            profilePicture: null,
            beneficiaryName: '',
            relation: '本人',
            beneficiaryID: '',
            beneficiaryBirthday: '',
            beneficiaryGender: '',
            beneficiaryPhone: '',
            beneficiaryAddress: '',
        },
        client: {
            // 投保人相關欄位
            username: '',
            bonusPoints: 0,
            id_number: '',
            birthday: '',
            gender: '',
            phone: '',
            email: '',
            address: '',
            location: '',
            product: '旅平險',
            startTime: '',
            endTime: '',
            sumAssured: '',
            premiums: '',
            medicalCoverage: '150萬',
            overseasIllnessCoverage: '150萬',
            overseasFlightsCoverage: '90萬',

            // 是否勾選附加險
            enableMedical: false,           // 傷害醫療 150 萬
            enableOverseasIllness: false,  // 海外突發疾病 150 萬
            enableOverseasFlights: false,  // 海外醫療專機  90 萬

            // 各附加險實際計算的費用
            medicalTreatment: 0,
            overseasIllness: 0,
            overseasFlights: 0,

            totalCost: '',
            days: null,
        },
        // 是否送出過表單（用於顯示錯誤提示）
        formSubmitted: false,
    }),
    actions: {
        // 設置紅利點數
        setBonusPoints() {
            if (this.client.totalCost) {
                this.client.bonusPoints = Math.floor(this.client.totalCost / 50);
            } else {
                this.client.bonusPoints = 0;
            }
        },

        // 產生保單號
        generateInsuranceNumber() {
            const storedInsuranceNumber = localStorage.getItem('insuranceNumber');
            if (storedInsuranceNumber) {
                this.form.insuranceNumber = storedInsuranceNumber;
            } else {
                const randomNum = Math.floor(Math.random() * 9999) + 1;
                const newInsuranceNumber = `T${randomNum.toString().padStart(4, '0')}`;
                localStorage.setItem('insuranceNumber', newInsuranceNumber);
                this.form.insuranceNumber = newInsuranceNumber;
            }
        },

        // 上傳圖片
        handleFileUpload(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64FullString = reader.result;
                    const base64PureString = base64FullString.replace(/^data:image\/\w+;base64,/, '');
                    this.form.profilePicture = base64PureString;
                    localStorage.setItem('profilePicture', base64PureString);
                };
                reader.readAsDataURL(file);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '無效檔案',
                    text: '請上傳有效的圖片檔案！',
                    confirmButtonColor: 'rgb(80, 200, 90)',
                });
            }
        },

        // 檢查日期並計算天數
        validateDates() {
            const start = new Date(this.client.startTime);
            const end = new Date(this.client.endTime);
            if (this.client.startTime && this.client.endTime) {
                if (end < start) {
                    Swal.fire({
                        icon: 'error',
                        title: '錯誤',
                        text: '結束日期不能小於生效日期！',
                        confirmButtonColor: 'rgb(80, 200, 90)',
                    }).then(() => {
                        this.client.endTime = '';
                        this.client.days = null;
                    });
                } else {
                    const diffTime = end.getTime() - start.getTime();
                    this.client.days = diffTime / (1000 * 60 * 60 * 24) + 1;
                    // 重新取得保費
                    this.fetchPremiums();
                }
            }
        },

        // 向後端抓取保費 (意外身故費用) 並計算總保費
        async fetchPremiums() {
            // 若沒填日期天數 或 沒選「意外身故」保額，就不處理
            if (!this.client.days || !this.client.sumAssured) return;

            const id = this.client.days;         // 假設保險天數作為 id
            const key = this.client.sumAssured;  // 保額對應的 key

            try {
                const response = await fetch(`http://localhost:8081/travelpremiums/${id}/${key}`);
                if (!response.ok) {
                    throw new Error('無法取得保費，請稍後再試');
                }
                // 這裡取得的為「意外身故費用」
                const premiums = await response.json();
                this.client.premiums = premiums;

                // 根據勾選狀況來計算三個附加險的實際費用
                // 1. 傷害醫療 150 萬 (意外身故費用 / 3)
                if (this.client.enableMedical) {
                    this.client.medicalTreatment = Math.floor(premiums / 3);
                } else {
                    this.client.medicalTreatment = 0;
                }

                // 2. 海外突發疾病 150 萬 (意外身故費用 * 0.8)
                if (this.client.enableOverseasIllness) {
                    this.client.overseasIllness = Math.floor(premiums * 0.8);
                } else {
                    this.client.overseasIllness = 0;
                }

                // 3. 海外醫療專機 90 萬 (意外身故費用 / 2)
                if (this.client.enableOverseasFlights) {
                    this.client.overseasFlights = Math.floor(premiums / 2);
                } else {
                    this.client.overseasFlights = 0;
                }

                // 總保費 = 意外身故費用 + (勾選的附加險費用)
                this.client.totalCost =
                    this.client.premiums +
                    this.client.medicalTreatment +
                    this.client.overseasIllness +
                    this.client.overseasFlights;
            } catch (error) {
                console.error('取得保費時發生錯誤:', error);
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '保險天數不得大於90天',
                    confirmButtonColor: 'rgb(80, 200, 90)',
                });
            }
        },

        // 按鈕：自動填入測試資料（投保人）
        autoFillDataForClient() {
            const mockData = {
                username: '王小明',
                id_number: 'A123456789',
                birthday: '1990-01-01',
                gender: '男',
                phone: '0912345678',
                email: 'huang25754@gmail.com',
                address: '台北市信義區信義路五段',
                location: '美加',
                // startTime: '2025-03-01',
                // endTime: '2025-03-30',
                // sumAssured: '1000W',
            };
            this.client = { ...this.client, ...mockData };
            this.validateDates(); // 更新天數 & 保費
        },

        // 按鈕：自動填入測試資料（受益人）
        autoFillDataForBene() {
            this.form.beneficiaryName = '胡小莉';
            this.form.relation = '配偶';
            this.form.beneficiaryID = 'H223456789';
            this.form.beneficiaryBirthday = '1993-12-25';
            this.form.beneficiaryGender = '女';
            this.form.beneficiaryPhone = '0988659845';
            this.form.beneficiaryAddress = '台北市大同區';
        },

        // 驗證手機格式
        validatePhone(phone) {
            const phoneRegex = /^09\d{8}$/;
            return phoneRegex.test(phone);
        },

        // 驗證投保人表單
        validateClientForm() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^09\d{8}$/;

            return (
                this.form.insuranceNumber &&
                this.client.username &&
                this.client.id_number &&
                this.client.birthday &&
                this.client.gender &&
                this.client.phone &&
                emailRegex.test(this.client.email) &&
                phoneRegex.test(this.client.phone) &&
                this.client.address &&
                this.client.product &&
                this.client.location &&
                this.client.startTime &&
                this.client.endTime &&
                this.client.sumAssured &&
                this.client.premiums !== '' // 意外身故費用（一定要有值）
            );
        },

        // 驗證受益人表單
        validateBeneForm() {
            return (
                this.form.beneficiaryName &&
                this.form.relation &&
                this.form.beneficiaryID &&
                this.form.beneficiaryBirthday &&
                this.form.beneficiaryGender &&
                this.validatePhone(this.form.beneficiaryPhone) &&
                this.form.beneficiaryAddress
            );
        },
    },
});
