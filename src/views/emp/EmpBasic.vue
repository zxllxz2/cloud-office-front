<template>
    <div>
        <div>
            <div style="display:flex;justify-content: space-between">
                <div>
                    <el-input size="small" style="width:400px;margin-right:8px" 
                            placeholder="Please input employee name for searching..."
                            prefix-icon="el-icon-search" v-model="empName" :disabled="showAdvSearch"
                            @keydown.enter.native="initEmps" @clear="clearSearch" clearable></el-input>
                    <el-button size="small" type="primary" :disabled="showAdvSearch"
                               icon="el-icon-search" @click="initEmps" round>Search</el-button>
                    <el-button size="small" type="primary" @click="showAdvSearch = !showAdvSearch" plain round>Advance   
                        <i style="margin-left:3px" :class="showAdvSearch ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" aria-hidden="true"></i>
                    </el-button>
                </div>
                <div>
                    <el-upload 
                        style="display:inline-flex; margin-right:9px"
                        action="/employee/basic/import"
                        :headers="importHeaders"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :disabled="importDataBtnDis">
                        <el-button type="success" size="small" :icon="importDataBtnIcon" :disabled="importDataBtnDis" round>
                            <!-- <i class="fa fa-level-up" aria-hidden="true"></i> -->
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" size="small" @click="exportData" icon="el-icon-download" round>
                        <!-- <i class="fa fa-level-down" aria-hidden="true"></i> -->
                        Export
                    </el-button>                
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddEmp" round>Add Employee</el-button>                
                </div>
            </div>
        </div>
        <transition name="slide-fade">
            <div v-show="showAdvSearch" style="border:2px solid #942408fa; border-radius:5px; box-sizing:border-box; padding:5px; margin: 10px 0px">
                <el-row class="advanceSearchRow" style="margin-top:3px">
                    <el-col :span="5">
                        Position:
                        <el-select v-model="searchValue.posId" size="mini" style="margin-left:7px;width:141px" clearable placeholder="Select position">
                            <el-option
                                v-for="item in positions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select> 
                    </el-col>
                    <el-col :span="6">
                        Job Level:
                        <el-select v-model="searchValue.jobLevelId" size="mini" style="margin-left:5px;width:160px" clearable placeholder="Select job level">
                            <el-option
                                v-for="item in joblevels"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6" style="margin-top:-5px">
                        Department:
                        <el-popover
                            placement="bottom"
                            title="Please pick departments"
                            width="240"
                            trigger="manual"
                            v-model="visibleAdv">
                            <el-tree :data="allDeps" :props="defaultProps" default-expand-all @node-click="handleNodeClickAdv"></el-tree>
                            <div class="posContainer" slot="reference" @click="showDepViewAdv"
                                style="margin-left:5px">
                                <p v-if="!this.inputDepName" style="color:#C0C4CC;font-family:Helvetica">Click to pick</p>{{inputDepName}}
                            </div>
                        </el-popover>
                    </el-col>
                    <el-col :span="7">
                        Political Status:
                        <el-select v-model="searchValue.politicId" size="mini" style="margin-left:5px;width:170px" clearable placeholder="Select status">
                            <el-option
                                v-for="item in politicsstatus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class="advanceSearchRow">
                    <el-col :span="5" style="margin-top:7px">
                        Ethnic:
                        <el-select v-model="searchValue.nationId" size="mini" style="margin-left:7px;width:150px" clearable placeholder="Select ethnic">
                            <el-option
                                v-for="item in nations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8" style="margin-top:8px">
                        Employment Form:
                        <el-radio-group v-model="searchValue.engageForm" size="mini" style="margin-left:4px;margin-top:-1px">
                            <el-radio-button label="劳动合同">劳动合同</el-radio-button>
                            <el-radio-button label="劳务合同">劳务合同</el-radio-button>
                            <el-radio-button label=''>空</el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="11" style="margin-top:7px">
                        Entry Date:
                        <el-date-picker
                            v-model="searchValue.beginDateScope"
                            type="daterange"
                            size="mini"
                            style="margin-left:7px"
                            value-format="yyyy-MM-dd"
                            range-separator="To"
                            start-placeholder="Start date"
                            end-placeholder="End date"
                            unlink-panels>
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row class="advanceSearchRow" style="margin-top:7px;margin-bottom:3px">
                    <el-col :span="6" :offset="20">
                        <el-button size="mini" type="info" icon="el-icon-circle-close" @click="clearAllAdvSearchEntries" plain>Cancel</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="initEmps" plain>Search</el-button>
                    </el-col>
                </el-row>
            </div>
        </transition>
        <div>
            <el-table
                size="small"
                :data="emps"
                border
                stripe
                style="margin-top:12px"
                align="center"
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
                prop="workID"
                label="Work ID"
                align="center"
                width="80">
            </el-table-column> 
            <el-table-column
                prop="gender"
                label="Gender"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="birthday"
                label="Birthday"
                align="center"
                width="80">
            </el-table-column>   
            <el-table-column
                prop="idCard"
                label="ID Card Number"
                align="center"
                width="140">
            </el-table-column>
            <el-table-column
                prop="wedlock"
                label="Marital Status"
                align="center"
                width="96">
            </el-table-column>
            <el-table-column
                prop="nation.name"
                label="Ethnic"
                align="center"
                width="90">
            </el-table-column>
            <el-table-column
                prop="nativePlace"
                label="Hometown"
                align="center"
                width="90">
            </el-table-column> 
            <el-table-column
                prop="politicsStatus.name"
                label="Political Status"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                prop="email"
                label="Email"
                align="center"
                width="190">
            </el-table-column>                                                                                              
            <el-table-column
                prop="phone"
                label="Mobile"
                align="center"
                width="90">
            </el-table-column>
            <el-table-column
                prop="address"
                label="Address"
                header-align="center"
                align="left"
                width="265">
            </el-table-column>  
            <el-table-column
                prop="department.name"
                label="Department"
                align="center"
                width="100">
            </el-table-column>
            <el-table-column
                prop="joblevel.name"
                label="Job Level"
                align="center"
                width="110">
            </el-table-column>            
            <el-table-column
                prop="position.name"
                label="Position"
                align="center"
                width="100">
            </el-table-column> 
            <el-table-column
                prop="engageForm"
                label="Employ Form"
                align="center"
                width="95">
            </el-table-column>     
            <el-table-column
                prop="tiptopDegree"
                label="Highest Degree"
                align="center"
                width="100">
            </el-table-column> 
            <el-table-column
                prop="school"
                label="Graduated School"
                align="center"
                width="135">
            </el-table-column>
            <el-table-column
                prop="specialty"
                label="Major"
                align="center"
                width="145">
            </el-table-column>
            <el-table-column
                prop="workState"
                label="Status"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="beginDate"
                label="Entry Date"
                align="center"
                width="80">
            </el-table-column>  
            <el-table-column
                prop="conversionTime"
                label="Promotion Date"
                align="center"
                width="105">
            </el-table-column>
            <el-table-column
                prop="beginContract"
                label="Contract Start"
                align="center"
                width="100">
            </el-table-column> 
            <el-table-column
                prop="endContract"
                label="Contract End"
                align="center"
                width="100">
            </el-table-column>
            <el-table-column
                label="Contract Period"
                align="center"
                width="110">
                <template slot-scope="scope">
                    <el-tag size="small">{{scope.row.contractTerm}}</el-tag>years</template>
            </el-table-column>
            <el-table-column
                label="Operations"                
                align="center"
                fixed="right"
                width="240">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" icon="el-icon-edit" circle @click="showEditEmpView(scope.row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteEmp(scope.row)" circle></el-button>
                    <el-button size="mini" type="primary">Check Advance</el-button>
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
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="80%"
            close-on-press-escape>
            <div>
                <el-form size="small" style="margin-left:15px" ref="empForm" :model="emp" :rules="rules">
                    <!-- 每一行总span为24 -->
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="Name:" prop="name">
                                <el-input size="mini" prefix-icon="el-icon-edit" style="margin-left:-5px;width:151px" v-model="emp.name" placeholder="Enter name" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Gender:" prop="gender">
                                <el-radio-group v-model="emp.gender" size="small" style="margin-left:-3px;margin-top:1px">
                                    <el-radio-button label="男">Male</el-radio-button>
                                    <el-radio-button label="女">Female</el-radio-button>
                                    <el-radio-button label="Non-Binary">Non-Binary</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Work ID:" prop="workID">
                                <el-input size="mini" style="margin-left:-6px;width:140px" v-model="emp.workID" prefix-icon="el-icon-s-data" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Birthday:" prop="birthday">
                                <el-date-picker
                                    v-model="emp.birthday"
                                    type="date"
                                    size="mini"
                                    style="width:180px;margin-left:-6px"
                                    value-format="yyyy-MM-dd"
                                    placeholder="Pick birthday">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="Ethnic:" prop="nationId">
                                <el-select v-model="emp.nationId" size="mini" style="margin-left:-6px;width:150px" clearable placeholder="Select ethnic">
                                    <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>  
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Email:" prop="email">
                                <el-input size="mini" style="margin-left:-5px;width:221px" v-model="emp.email" placeholder="Enter email" prefix-icon="el-icon-message" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Hometown:" prop="nativePlace">
                                <el-input size="mini" style="margin-left:-7px;width:127px" v-model="emp.nativePlace" placeholder="Hometown" prefix-icon="el-icon-edit" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Address:" prop="address">
                                <el-input size="mini" style="margin-left:-5px;width:210px" v-model="emp.address" placeholder="Enter address" prefix-icon="el-icon-edit" clearable></el-input>
                            </el-form-item>
                        </el-col>                                                                        
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="Position:" prop="posId">
                                <el-select v-model="emp.posId" size="mini" style="margin-left:-7px;width:141px" clearable placeholder="Select position">
                                    <el-option
                                        v-for="item in positions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select> 
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Job Level:" prop="jobLevelId">
                                <el-select v-model="emp.jobLevelId" size="mini" style="margin-left:-5px;width:160px" clearable placeholder="Select job level">
                                    <el-option
                                        v-for="item in joblevels"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Department:" prop="departmentId" style="height:32px">
                                <!-- <el-input size="mini" style="margin-left:-6px;width:172px" v-model="emp.departmentId" placeholder="Enter department" prefix-icon="el-icon-edit" clearable></el-input> -->
                                <el-popover
                                    placement="right"
                                    title="Please pick departments"
                                    width="240"
                                    trigger="manual"
                                    v-model="visible">
                                    <el-tree :data="allDeps" :props="defaultProps" default-expand-all @node-click="handleNodeClick"></el-tree>
                                    <div class="posContainer" slot="reference" @click="showDepView">
                                        <p v-if="!this.inputDepName" style="color:#C0C4CC;font-family:Helvetica">Click to pick</p>{{inputDepName}}
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Political Status:" prop="politicId">
                                <el-select v-model="emp.politicId" size="mini" style="margin-left:-4px;width:170px" clearable placeholder="Select status">
                                    <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="School:" prop="school">
                                <el-input size="mini" style="margin-left:-6px;width:180px" clearable v-model="emp.school" placeholder="Enter school name" prefix-icon="el-icon-school"></el-input>    
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Highest Degree:" prop="tiptopDegree">
                                <el-select v-model="emp.tiptopDegree" size="mini" style="margin-left:-5px;width:90px" clearable placeholder="Degree">
                                    <el-option
                                        v-for="item in degrees"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Major:" prop="specialty">
                                <el-input size="mini" style="margin-left:-6px;width:203px" v-model="emp.specialty" clearable placeholder="Enter major" prefix-icon="el-icon-s-promotion"></el-input>    
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Mobile:" prop="phone">
                                <el-input size="mini" style="margin-left:-6px;width:185px" v-model="emp.phone" placeholder="Enter phone number" prefix-icon="el-icon-phone" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="Entry Date:" prop="beginDate">
                                <el-date-picker
                                    v-model="emp.beginDate"
                                    type="date"
                                    size="mini"
                                    style="width:135px;margin-left:-7px"
                                    value-format="yyyy-MM-dd"
                                    placeholder="Pick a date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Promotion Date:" prop="conversionTime">
                                <el-date-picker
                                    v-model="emp.conversionTime"
                                    type="date"
                                    size="mini"
                                    style="width:135px;margin-left:-7px"
                                    value-format="yyyy-MM-dd"
                                    placeholder="Pick a date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Contract Start Date:" prop="beginContract">
                                <el-date-picker
                                    v-model="emp.beginContract"
                                    type="date"
                                    size="mini"
                                    style="width:135px;margin-left:-4px"
                                    value-format="yyyy-MM-dd"
                                    placeholder="Pick a date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Contract End Date:" prop="endContract">
                                <el-date-picker
                                    v-model="emp.endContract"
                                    type="date"
                                    size="mini"
                                    style="width:140px;margin-left:-7px"
                                    value-format="yyyy-MM-dd"
                                    placeholder="Pick a date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="ID Card Number:" prop="idCard">
                                <el-input size="mini" style="margin-left:-5px;width:220px" v-model="emp.idCard" placeholder="Enter ID number" prefix-icon="el-icon-s-custom" clearable></el-input>    
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Employment Form:" prop="engageForm">
                                <el-radio-group v-model="emp.engageForm" size="small" style="margin-left:-3px;margin-top:1px">
                                    <el-radio-button label="劳动合同">劳动合同</el-radio-button>
                                    <el-radio-button label="劳务合同">劳务合同</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Marital Status:" prop="wedlock">
                                <el-radio-group v-model="emp.wedlock" size="small" style="margin-left:-3px;margin-top:1px">
                                    <el-radio-button label="已婚">已婚</el-radio-button>
                                    <el-radio-button label="未婚">未婚</el-radio-button>
                                    <el-radio-button label="离异">离异</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="warning" @click="clearAllEntries" prefix-icon="el-icon-brush">Clear All</el-button>
                <el-button size="small" type="info" @click="cancelAddEmp">Cancel</el-button>
                <el-button size="small" type="primary" @click="doAddEmp">Confirm</el-button>
            </span>
        </el-dialog>        
    </div>
</template>
        
        
<script>
export default{
    name: 'EmpBasic',
    data() {
        return {
            visibleAdv: false,
            searchValue: {
                posId: null,
                jobLevelId: null,
                departmentId: null,
                politicId: null,
                nationId: null,
                engageForm: '',
                beginDateScope: null
            },
            showAdvSearch: false,
            emps: [],
            multipleSelection: [],
            loading: false,
            total: 0,
            currentPage: 1,
            size: 10,
            empName: '',
            dialogVisible: false,
            nations: [],
            joblevels: [],
            politicsstatus: [],
            positions: [],
            degrees: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他'],
            visible: false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            allDeps: [],
            inputDepName: '',
            title: '',
            emp: {
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: '',
                workState: '在职',
                workID: '',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            },
            rules: {
                name: [{required: true, message: 'Name is required', trigger: 'blur'}],
                gender: [{required: true, message: 'Gender is required', trigger: 'blur'}],
                birthday: [{required: true, message: 'Birthday is required', trigger: 'blur'}],
                idCard: [{required: true, message: 'ID card number is required', trigger: 'blur'},
                         {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: 'Incorrect ID format', trigger: 'blur'}],
                wedlock: [{required: true, message: 'Marital status is required', trigger: 'blur'}],
                nationId: [{required: true, message: 'Ethnic is required', trigger: 'blur'}],
                nativePlace: [{required: true, message: 'Hometown is required', trigger: 'blur'}],
                politicId: [{required: true, message: 'Political status is required', trigger: 'blur'}],
                email: [{required: true, message: 'Email is required', trigger: 'blur'},
                        {type: 'email', message: 'Incorrect email format', trigger: 'blur'}],
                phone: [{required: true, message: 'Phone number is required', trigger: 'blur'}],
                address: [{required: true, message: 'Address is required', trigger: 'blur'}],
                departmentId: [{required: true, message: 'Department is required', trigger: 'blur'}],
                jobLevelId: [{required: true, message: 'Job level is required', trigger: 'blur'}],
                posId: [{required: true, message: 'Position is required', trigger: 'blur'}],
                engageForm: [{required: true, message: 'Employment form is required', trigger: 'blur'}],
                tiptopDegree: [{required: true, message: 'Degree is required', trigger: 'blur'}],
                specialty: [{required: true, message: 'Major is required', trigger: 'blur'}],
                school: [{required: true, message: 'School is required', trigger: 'blur'}],
                beginDate: [{required: true, message: 'Entry date is required', trigger: 'blur'}],
                contractTerm: [{required: true, message: 'Contract period is required', trigger: 'blur'}],
                conversionTime: [{required: true, message: 'Promotion time is required', trigger: 'blur'}],
                beginContract: [{required: true, message: 'Contract start date is required', trigger: 'blur'}],
                endContract: [{required: true, message: 'Contract end date is required', trigger: 'blur'}],
                workID: [{required: true, message: 'Work ID is required', trigger: 'blur'}]
            },
            importDataBtnText: 'Import',
            importDataBtnIcon: 'el-icon-upload2',
            importDataBtnDis: false,
            importHeaders: {
                Authorization: window.sessionStorage.getItem('tokenStr')
            }
        }
    },
    mounted() {
        this.initEmps();
        this.initData();
        this.initPositions();
    },
    methods: {
        clearAllAdvSearchEntries() {
            this.searchValue = {
                posId: null,
                jobLevelId: null,
                departmentId: null,
                politicId: null,
                nationId: null,
                engageForm: '',
                beginDateScope: null
            }
            this.inputDepName = '';
        },
        showDepViewAdv() {
            this.visibleAdv = !this.visibleAdv;
        },
        handleNodeClickAdv(data) {
            this.searchValue.departmentId = data.id;
            this.inputDepName = data.name;
            this.visibleAdv = !this.visibleAdv;
        },
        onSuccess(response) {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = "Import";
            this.importDataBtnDis = false;
            this.initEmps();
            this.$message.success(response);
        },
        onError(err) {
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = "Import";
            this.importDataBtnDis = false;
            this.$message.error(err);
        },
        beforeUpload() {
            this.importDataBtnIcon = 'el-icon-loading';
            this.importDataBtnText = "Uploading...";
            this.importDataBtnDis = true;
        },
        exportData() {
            this.downloadRequest('/employee/basic/export');
        },
        clearAllEntries() { //clear everything except work ID
            let oriID = this.emp.workID;
            this.emp = {
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                workID: oriID,
                specialty: '',
                school: '',
                beginDate: '',
                workState: '在职',
                contractTerm: null,
                conversionTime: '',
                notWorkDate: null,
                beginContract: '',
                endContract: '',
                workAge: null,
                salaryId: null
            };
            this.inputDepName = '';
        },
        showEditEmpView(data) {
            this.title = 'Edit Employee Info';
            this.emp = data;
            this.inputDepName = data.department.name;
            this.initPositions();
            this.dialogVisible = true;
        },
        deleteEmp(data) {
            this.$confirm('This will permanently delete the employee ['+ data.name +']. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/employee/basic/' + data.id).then(resp => {
                    if (resp) {
                        this.initEmps();
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Delete canceled'
                });          
            });
        },
        cancelAddEmp() {
            this.visible = false;
            this.dialogVisible = false;
        },
        doAddEmp() {
            if (this.emp.id) {      //添加员工时id应为null，更新时id为其sql中存放id，故以此进行判断
                //更新
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.putRequest('/employee/basic/', this.emp).then(resp => {
                            if (resp) {
                                this.initEmps();
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            } else {
                //添加
                this.$refs['empForm'].validate(valid => {
                    if (valid) {
                        this.postRequest('/employee/basic/', this.emp).then(resp => {
                            if (resp) {
                                this.initEmps();
                            }
                            this.dialogVisible = false;
                        });
                    }
                });
            }

        },
        handleNodeClick(data) {
            this.emp.departmentId = data.id;
            this.inputDepName = data.name;
            this.visible = !this.visible;
        },
        showDepView() {
            this.visible = !this.visible;
        },
        getMaxWorkID() {
            this.getRequest('/employee/basic/maxWorkID').then(resp => {
                if (resp) {
                    this.emp.workID = resp.obj;
                }
            });
        },
        initPositions() {
            this.getRequest('/employee/basic/positions').then(resp => {
                if (resp) {
                    this.positions = resp;
                }
            });
        },
        initData() {
            if (!window.sessionStorage.getItem('nations')) {
                this.getRequest('/employee/basic/nations').then(resp => {
                    if (resp) {
                        this.nations = resp;
                        window.sessionStorage.setItem('nations', JSON.stringify(resp));
                    }
                });
            } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
            }

            if (!window.sessionStorage.getItem('joblevels')) {
                this.getRequest('/employee/basic/joblevels').then(resp => {
                    if (resp) {
                        this.joblevels = resp;
                        window.sessionStorage.setItem('joblevels', JSON.stringify(resp));
                    }
                });
            } else {
                this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
            }

            if (!window.sessionStorage.getItem('politicsstatus')) {
                this.getRequest('/employee/basic/politicsstatus').then(resp => {
                    if (resp) {
                        this.politicsstatus = resp;
                        window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp));
                    }
                });
            } else {
                this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
            }
            
            if (!window.sessionStorage.getItem('allDeps')) {
                this.getRequest('/employee/basic/deps').then(resp => {
                    if (resp) {
                        this.allDeps = resp;
                        window.sessionStorage.setItem('allDeps', JSON.stringify(resp));
                    }
                });
            } else {
                this.allDeps = JSON.parse(window.sessionStorage.getItem("allDeps"));
            }
        },
        showAddEmp() {
            this.title = 'Add Employee';
            this.clearAllEntries();
            this.getMaxWorkID(); 
            this.initPositions();
            this.dialogVisible = true;
        },
        clearSearch() {
            this.currentPage = 1;
            this.initEmps();
        },
        sizeChange(siz) {
            this.size = siz;
            this.initEmps();
        },
        currentChange(currentPag) {
            this.currentPage = currentPag;
            this.initEmps();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        initEmps() {
            this.loading = true;
            let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size;
            if (this.showAdvSearch) {
                if (this.searchValue.politicId) {
                    url += '&politicId=' + this.searchValue.politicId;
                }
                if (this.searchValue.nationId) {
                    url += '&nationId=' + this.searchValue.nationId;
                }
                if (this.searchValue.posId) {
                    url += '&posId=' + this.searchValue.posId;
                }
                if (this.searchValue.jobLevelId) {
                    url += '&jobLevelId=' + this.searchValue.jobLevelId;
                }
                if (this.searchValue.engageForm) {
                    url += '&engageForm=' + this.searchValue.engageForm;
                }
                if (this.searchValue.departmentId) {
                    url += '&departmentId=' + this.searchValue.departmentId;
                }
                if (this.searchValue.beginDateScope) {
                    url += '&beginDateScope=' + this.searchValue.beginDateScope;
                }
            } else {
                url += '&name=' + this.empName;
            }
            this.getRequest(url).then(resp => {
                if (resp) {
                    this.emps = resp.data;
                    this.total = resp.total;
                }
                this.loading = false;
            });
        }
    }
}
</script>
        
        
<style>
    .posContainer {
        width: 170px; 
        display: inline-flex; 
        border: 1px solid #dedede; 
        height: 28px; 
        border-radius: 5px; 
        cursor: pointer; 
        margin-top: 4px; 
        margin-left: -5px;
        align-items: center;
        font-size: 12px;
        padding-left: 12px;
        padding-top: 1px;
        box-sizing: border-box;
    }
    .advanceSearchRow {
        margin-left: 12px;
    }
    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>