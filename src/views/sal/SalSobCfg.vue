<template>
    <div>
        <el-table
            size="small"
            :data="emps"
            border
            stripe
            style="margin-top:12px"
            v-loading="loading"
            element-loading-text="Loading..."
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                align="center"
                width="40">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                fixed
                label="ID"
                width="40">
            </el-table-column>
            <el-table-column
                prop="name"
                label="Name"
                fixed
                align="center"
                width="100">
            </el-table-column>
            <el-table-column
                prop="gender"
                label="Gender"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="workID"
                label="Work ID"
                align="center"
                width="90">
            </el-table-column>
            <el-table-column
                prop="workState"
                label="Status"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="email"
                label="Email"
                align="center"
                width="200">
            </el-table-column> 
            <el-table-column
                prop="phone"
                label="Mobile"
                align="center"
                width="140">
            </el-table-column>
            <el-table-column
                prop="department.name"
                label="Department"
                align="center"
                width="140">
            </el-table-column>
            <el-table-column
                label="Payroll"
                width="230px"
                align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.salary" effect="light">
                        <div slot="content">
                             <table style="width:170px">
                                 <tr>
                                     <td>Basic Salary:</td>
                                     <td>{{scope.row.salary.basicSalary}}</td>
                                 </tr>
                                 <tr>
                                     <td>Transportation Allow.:</td>
                                     <td>{{scope.row.salary.trafficSalary}}</td>
                                 </tr>
                                 <tr>
                                     <td>Lunch Allow.:</td>
                                     <td>{{scope.row.salary.lunchSalary}}</td>
                                 </tr>
                                 <tr>
                                     <td>Bonus:</td>
                                     <td>{{scope.row.salary.bonus}}</td>
                                 </tr>
                                 <tr>
                                     <td>Pension Ratio:</td>
                                     <td>{{scope.row.salary.pensionPer}}</td>
                                 </tr>
                                 <tr>
                                     <td>Pension Base:</td>
                                     <td>{{scope.row.salary.pensionBase}}</td>
                                 </tr>
                                 <tr>
                                     <td>Medical Ins. Ratio:</td>
                                     <td>{{scope.row.salary.medicalPer}}</td>
                                 </tr>
                                 <tr>
                                     <td>Medical Ins. Base:</td>
                                     <td>{{scope.row.salary.medicalBase}}</td>
                                 </tr>
                                 <tr>
                                     <td>Provident Fund Ratio:</td>
                                     <td>{{scope.row.salary.accumulationFundPer}}</td>
                                 </tr>
                                 <tr>
                                     <td>Provident Fund Base:</td>
                                     <td>{{scope.row.salary.accumulationFundBase}}</td>
                                 </tr>
                             </table>
                        </div>
                        <el-tag size="small" type="primary">{{scope.row.salary.name}}</el-tag>
                    </el-tooltip>
                    <el-tag size="small" type="danger" v-else>暂未设置</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="Operations"
                fixed="right"              
                align="center">
                <template slot-scope="scope">
                <el-popover
                    placement="left"
                    title="Edit Payroll"                    
                    width="200"
                    @show="showPops(scope.row.salary)"
                    @hide="hidePops(scope.row)"
                    trigger="click">
                    <div>
                        <el-select size="mini" v-model="currentSalary" clearable placeholder="Select">
                            <el-option
                                v-for="item in salaries"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button slot="reference" size="mini" type="success" icon="el-icon-edit-outline">Edit Payroll</el-button>
                </el-popover>
                </template>
            </el-table-column> 
        </el-table>
        <div style="display:flex; justify-content:flex-end; margin-top:7px">
            <el-pagination
                background
                :total="total"
                layout="sizes, prev, pager, next, jumper, ->, total"
                @current-change="currentChange"
                @size-change="sizeChange">
            </el-pagination>
        </div>
    </div>
</template>
        
        
<script>
export default{
    name: 'SalSobCfg',
    data() {
        return {
            salaries: [],
            currentSalary: null,
            emps: [],
            currentPage: 1,
            size: 10,
            total: 0,
            multipleSelection: [],
            loading: false
        }
    },
    mounted() {
        this.initEmps();
        this.initSalaries();
    },
    methods: {
        hidePops(data) {
            if (this.currentSalary && this.currentSalary !== data.salary.id) {
                this.putRequest('/salary/sobcfg/?eid=' + data.id + "&sid=" + this.currentSalary).then(resp => {
                    if (resp) {
                        this.initEmps();
                    }
                });
            }
        },
        showPops(data) {
            if (data) {
                this.currentSalary = data.id; 
            } else {
                this.currentSalary = null;
            }
        },
        initSalaries() {
            this.getRequest('/salary/sobcfg/salaries').then(resp => {
                if (resp) {
                    this.salaries = resp;
                }
            });
        },
        currentChange(page) {
            this.currentPage = page;
            this.initEmps();
        },
        sizeChange(size) {
            this.size = size;
            this.initEmps();
        },
        initEmps() {
            this.loading = true;
            this.getRequest('/salary/sobcfg/?currentPage=' + this.currentPage + '&size=' + this.size).then(resp => {
                if (resp) {
                    this.emps = resp.data;
                    this.total = resp.total;
                }
                this.loading = false;
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