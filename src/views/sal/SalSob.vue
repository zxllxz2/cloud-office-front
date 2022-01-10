<template>
    <div>
        <div style="display:flex; justify-content:space-between; margin-left:10px; margin-right: 30px">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddSalaryView" round>Add Payroll</el-button>
            <el-button size="small" type="success" icon="el-icon-refresh" @click="initSalaries" round>Refresh</el-button>
        </div>
        <div style="margin-top:10px; margin-left:15px">
            <el-table
                :data="salaries" 
                border stripe
                style="width:98%"
                size="small"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    align="center"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="id"
                    align="center"
                    label="ID"
                    width="40">
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    label="Payroll Name"
                    width="140">
                </el-table-column>
                <el-table-column
                    prop="basicSalary"
                    label="Basic Salary"
                    align="center"
                    width="85">
                </el-table-column>
                <el-table-column
                    prop="trafficSalary"
                    align="center"
                    label="Transportation ALL."
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="lunchSalary"
                    label="Lunch ALL."
                    align="center"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="bonus"
                    label="Bonus"
                    align="center"
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="Created Date"
                    align="center"
                    width="110">
                </el-table-column>
                <el-table-column
                    label="Pension"
                    align="center">
                    <el-table-column
                        prop="pensionPer"
                        label="Ratio"
                        align="center"
                        width="70">
                    </el-table-column>
                    <el-table-column
                        prop="pensionBase"
                        label="Base"
                        align="center"
                        width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    label="Medical Insurance"
                    align="center">
                    <el-table-column
                        prop="medicalPer"
                        label="Ratio"
                        align="center"
                        width="70">
                    </el-table-column>
                    <el-table-column
                        prop="medicalBase"
                        align="center"
                        label="Base"
                        width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                    label="Provident Fund"
                    align="center">
                    <el-table-column
                        prop="accumulationFundPer"
                        label="Ratio"
                        align="center"
                        width="70">
                    </el-table-column>
                    <el-table-column
                        prop="accumulationFundBase"
                        label="Base"
                        align="center"
                        width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="Operations" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="success"
                            @click="showEditView(scope.row)">Edit</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                        @click="handleDelete(scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%"
            top="10vh">
            <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:-50px">
                <el-steps direction="vertical" :active="activeItemIndex" :space="40">
                    <el-step :title="itemName" v-for="(itemName, index) in salaryItemName" :key="index"></el-step>
                </el-steps>
                <el-input :placeholder="'Please input ' + salaryItemName[index] + '...'" 
                          v-for="(value, title, index) in salaryValue" :key="index"
                          v-show="activeItemIndex === index" size="small"
                          prefix-icon="el-icon-edit" v-model="salaryValue[title]"
                          style="width:350px" clearable></el-input>
            </div>
            <span slot="footer" style="margin-right:20px">
                <el-button size="small" style="margin-right:6px" 
                           type="primary" @click="prevStep" icon="el-icon-d-arrow-left"
                           :disabled="activeItemIndex === 0 ? true : false">Previous</el-button>
                <el-button size="small" style="width:95px;margin-right:6px" 
                           :icon="activeItemIndex === 10 ? 'el-icon-s-promotion' : 'el-icon-d-arrow-right'"
                           :type="activeItemIndex === 10 ? 'success' : 'primary'" 
                           @click="nextStep">{{activeItemIndex === 10 ? 'Submit' : 'Next'}}</el-button>
                <el-button size="small" type="info" icon="el-icon-circle-close" @click="dialogVisible = false">Cancel</el-button>
            </span>
        </el-dialog>
    </div>
</template>
        
        
<script>
export default{
    name: 'SalSob',
    data() {
        return {
            dialogTitle: 'Add Payroll',
            activeItemIndex: 0,
            multipleSelection: [],
            salaries: [],
            dialogVisible: false,
            salaryItemName: [
                'Payroll Name',
                'Basic Salary',
                'Transportation Allowance',
                'Lunch Allowance',
                'Bonus',
                'Pension Ratio',
                'Pension Base',
                'Medical Insurance Ratio',
                'Medical Insurance Base',
                'Provident Fund Ratio',
                'Provident Fund Base'
            ],
            salaryValue: {
                name: '',
                basicSalary: 0,
                trafficSalary: 0,
                lunchSalary: 0,
                bonus: 0,
                pensionPer: 0,
                pensionBase: 0,
                medicalPer: 0,
                medicalBase: 0,
                accumulationFundPer: 0,
                accumulationFundBase: 0
            }
        }
    },
    mounted() {
        this.initSalaries();
    },
    methods: {
        showEditView(data) {
            this.dialogTitle = 'Edit Payroll';
            this.activeItemIndex = 0;

            this.salaryValue.id = data.id;
            this.salaryValue.name = data.name;
            this.salaryValue.basicSalary = data.basicSalary;
            this.salaryValue.trafficSalary = data.trafficSalary;
            this.salaryValue.lunchSalary = data.lunchSalary;
            this.salaryValue.bonus = data.bonus;
            this.salaryValue.pensionPer = data.pensionPer;
            this.salaryValue.pensionBase = data.pensionBase;
            this.salaryValue.medicalPer = data.medicalPer;
            this.salaryValue.medicalBase = data.medicalBase;
            this.salaryValue.accumulationFundPer = data.accumulationFundPer;
            this.salaryValue.accumulationFundBase = data.accumulationFundBase;

            this.dialogVisible = true;
        },
        prevStep() {
            if (this.activeItemIndex <= 0) {
                alert("Oversize!");
            } else {
                --this.activeItemIndex;
            }
        },
        nextStep() {
            if (this.activeItemIndex >= 10) {
                if (!this.salaryValue.name) {
                    alert("Payroll name should NOT be empty!");
                    this.activeItemIndex = 0;
                } else {
                    if (this.salaryValue.id) {
                        this.putRequest('/salary/sob/', this.salaryValue).then(resp => {
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        });
                    } else {
                        this.postRequest('/salary/sob/', this.salaryValue).then(resp => {
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        });
                    }
                }
            } else {
                ++this.activeItemIndex;
            }
        },
        showAddSalaryView() {
            this.dialogTitle = 'Add Payroll';
            this.salaryValue = {
                name: '',
                basicSalary: 0,
                trafficSalary: 0,
                lunchSalary: 0,
                bonus: 0,
                pensionPer: 0,
                pensionBase: 0,
                medicalPer: 0,
                medicalBase: 0,
                accumulationFundPer: 0,
                accumulationFundBase: 0
            };
            this.activeItemIndex = 0;
            this.dialogVisible = true;
        },
        handleDelete(data) {
            this.$confirm('This will permanently delete the payroll ['+ data.name +']. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/salary/sob/' + data.id).then(resp => {
                    if (resp) {
                        this.initSalaries();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });          
            });
        },
        initSalaries() {
            this.getRequest('/salary/sob/').then(resp => {
                if (resp) {
                    this.salaries = resp;
                }
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }  
    }
}
</script>
        
        
<style>
        
</style>