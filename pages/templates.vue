<template>
  <div>
    <!-- WIDGET CONFIGURATOR -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Widgets {{ iotIndicatorConfig.column }}</h4>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-6">
            <!-- WIDGETS SELECTOR -->
            <el-select
              v-model="widgetType"
              class="select-success"
              placeholder="Select Widget"
              style="width: 100%"
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Number Chart INPUT <-"
              >
              </el-option>

              <el-option
                class="text-dark"
                value="multiple_chart"
                label="Energy Chart INPUT <-"
              >
              </el-option>

              <el-option
                class="text-dark"
                value="smoothchart"
                label="Smooth Chart INPUT <-"
              >
              </el-option>

              <el-option
                class="text-dark"
                value="costcomponent"
                label="Cost Component INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="indicator"
                label="Boolean Indicator INPUT <-"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="map"
                label="Map INPUT <-"
              ></el-option>
              <el-option
                class="text-dark"
                value="switch"
                label="Switch OUTPUT ->"
              ></el-option>
              <el-option
                class="text-dark"
                value="button"
                label="Button OUTPUT ->"
              ></el-option>

              <el-option
                class="text-dark"
                value="simple"
                label="Number Input <-"
              ></el-option>

              <el-option
                class="text-dark"
                value="DataBetween"
                label="DataBetween <-"
              ></el-option>

              <el-option
                class="text-dark"
                value="TableSimple"
                label="TableSimple <-"
              ></el-option>
            </el-select>

            <br />
            <br />

            <!-- FORMS DATA BETWEEN CHART TYPE -->
            <div v-if="widgetType == 'DataBetween'">
              <base-input
                v-model="DataBetweenConfig.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>

              <br />

              <base-input
                v-model="DataBetweenConfig.nombre"
                label="Nombre a mostrar"
                type="text"
              >
              </base-input>

              <br />

              <base-input
                v-model="DataBetweenConfig.unit"
                label="Unit"
                type="text"
              >
              </base-input>

              <br />

              <el-select
                v-model="DataBetweenConfig.variable"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option value="Yb7TcLx9pK" label="VoltajeData"></el-option>
                <el-option value="Qf4GjSd2hN" label="CorrienteData"></el-option>
                <el-option value="Lm6VzKx8rJ" label="PotenciaData"></el-option>
                <el-option value="Hc2BtFg9nR" label="EnergiaData"></el-option>
              </el-select>
              <br /><br /><br />

              <el-select
                v-model="DataBetweenConfig.type"
                class="select-success"
                placeholder="Selecciona el tipo"
                style="width: 100%"
              >
                <el-option
                  value="Voltage_Phase_1"
                  label="Voltaje fase 1"
                ></el-option>
                <el-option
                  value="Voltage_Phase_2"
                  label="Voltaje fase 2"
                ></el-option>
                <el-option
                  value="Voltage_Phase_3"
                  label="Voltaje fase 3"
                ></el-option>
              </el-select>
              <br /><br /><br />

              <el-select
                v-model="DataBetweenConfig.type2"
                class="select-success"
                placeholder="Selecciona el tipo"
                style="width: 100%"
              >
                <el-option
                  value="Voltage_Phase_1"
                  label="Voltaje fase 1"
                ></el-option>
                <el-option
                  value="Voltage_Phase_2"
                  label="Voltaje fase 2"
                ></el-option>
                <el-option
                  value="Voltage_Phase_3"
                  label="Voltaje fase 3"
                ></el-option>
              </el-select>
              <br /><br /><br />

              <el-select
                v-model="DataBetweenConfig.type3"
                class="select-success"
                placeholder="Selecciona el tipo"
                style="width: 100%"
              >
                <el-option
                  value="Voltage_Phase_1"
                  label="Voltaje fase 1"
                ></el-option>
                <el-option
                  value="Voltage_Phase_2"
                  label="Voltaje fase 2"
                ></el-option>
                <el-option
                  value="Voltage_Phase_3"
                  label="Voltaje fase 3"
                ></el-option>
              </el-select>
              <br /><br /><br />

              <base-input
                v-model.number="DataBetweenConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <br />

              <base-input
                v-model="DataBetweenConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="DataBetweenConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>
            </div>

            <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="widgetType == 'numberchart'">
              <base-input
                v-model="ncConfig.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>

              <br />

              <base-input
                v-model="ncConfig.nombre"
                label="Nombre a mostrar"
                type="text"
              >
              </base-input>

              <br />

              <base-input v-model="ncConfig.unit" label="Unit" type="text">
              </base-input>

              <br />

              <base-input
                v-model.number="ncConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <br />

              <el-select
                v-model="ncConfig.historical"
                label="Historical"
                class="select-success"
                placeholder="Select true/false "
                style="width: 100%"
              >
                <el-option value="false" label="False"></el-option>
                <el-option value="true" label="True"></el-option>
              </el-select>

              <br />

              <base-input
                v-model="ncConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="ncConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="ncConfig.tipo"
                label="Animacion"
                class="select-success"
                placeholder="Select type "
                style="width: 100%"
              >
                <el-option value="column" label="Tipo Columna"></el-option>
                <el-option value="spline" label="Tipo Linea Suave"></el-option>
                <el-option value="line" label="Tipo Linea"></el-option>
                <el-option value="scatter" label="Tipo Puntos"></el-option>
                <el-option value="areaspline" label="Tipo Area"></el-option>
                <el-option value="area" label="Tipo Linea Area"></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="ncConfig.animacion"
                label="Tipo Grafico"
                class="select-success"
                placeholder="Select Animation Duration"
                style="width: 100%"
              >
                <el-option value="0" label="0"></el-option>
                <el-option value="500" label="500"></el-option>

                <el-option value="1000" label="1000"></el-option>

                <el-option value="2000" label="2000"></el-option>
              </el-select>

              <br /><br /><br />
              <el-select
                v-model="ncConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <div v-if="widgetType == 'multiple_chart'">
              <el-select
                v-model="MultipleChartConfig.cantidad"
                class="select-success"
                placeholder="Select Quantity"
                style="width: 100%"
              >
                <el-option value="1" label="1"></el-option>
                <el-option value="2" label="2"></el-option>
                <el-option value="3" label="3"></el-option>
                <el-option value="4" label="4"></el-option>
                <el-option value="5" label="5"></el-option>
                <el-option value="6" label="6"></el-option>
                <el-option value="7" label="7"></el-option>
                <el-option value="8" label="8"></el-option>
                <el-option value="9" label="9"></el-option>
              </el-select>
              <br /><br /><br />

              <div v-for="i in parseInt(MultipleChartConfig.cantidad)" :key="i">
                <base-input
                  v-model="MultipleChartConfig['nombre_' + i]"
                  :label="'Nombre ' + i + ' a mostrar'"
                  type="text"
                >
                </base-input>
                <br />

                <br />
              </div>

              <base-input
                v-model.number="MultipleChartConfig.unit_1"
                label="Unidad"
                type="text"
              >
              </base-input>

              <el-select
                v-model="MultipleChartConfig.variable"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  v-for="(value, key) in variables"
                  :key="key"
                  :value="key"
                  :label="value.label"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-if="variables[MultipleChartConfig.variable]"
                v-model="MultipleChartConfig.subVariable"
                class="select-success"
                placeholder="Select SubVariable"
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="option in variables[MultipleChartConfig.variable]
                    .options"
                  :key="option"
                  :value="option"
                  :label="option"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <base-input
                v-model.number="MultipleChartConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <base-input
                v-model="MultipleChartConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="MultipleChartConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="MultipleChartConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="MultipleChartConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="MultipleChartConfig.TipoGrafico"
                label="Tipo Grafico Live"
                class="select-success"
                placeholder="Select type "
                style="width: 100%"
              >
                <el-option value="column" label="Tipo Columna"></el-option>
                <el-option value="spline" label="Tipo Linea Suave"></el-option>
                <el-option value="line" label="Tipo Linea"></el-option>
                <el-option value="scatter" label="Tipo Puntos"></el-option>
                <el-option value="areaspline" label="Tipo Area"></el-option>
                <el-option value="area" label="Tipo Linea Area"></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="MultipleChartConfig.animacion"
                label="Tipo Grafico"
                class="select-success"
                placeholder="Select Animation Duration"
                style="width: 100%"
              >
                <el-option value="0" label="0"></el-option>
                <el-option value="500" label="500"></el-option>

                <el-option value="1000" label="1000"></el-option>

                <el-option value="2000" label="2000"></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="MultipleChartConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="widgetType == 'smoothchart'">
              <base-input
                v-model="SmoothChartConfig.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="SmoothChartConfig.unit"
                label="Unit"
                type="text"
              >
              </base-input>

              <base-input
                v-model.number="SmoothChartConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>
              <br />

              <base-input
                v-model="SmoothChartConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="SmoothChartConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="SmoothChartConfig.chartTimeAgo"
                label="Chart Back Time (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="SmoothChartConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="SmoothChartConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM SIMPLE NUMBER TYPE -->

            <div v-if="widgetType == 'simple'">

              <base-input
                v-model.number="iotSimpleConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <br />

              <base-input
                v-model.number="iotSimpleConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>

              <el-select
                           v-model="iotSimpleConfig.cantidad"
               class="select-success"
               placeholder="Select Quantity"
               style="width: 100%"
               @change="updateMatriz"
             >

                <el-option value="1" label="1"></el-option>
                <el-option value="2" label="2"></el-option>
                <el-option value="3" label="3"></el-option>
                <el-option value="4" label="4"></el-option>
                <el-option value="5" label="5"></el-option>
                <el-option value="6" label="6"></el-option>
                <el-option value="7" label="7"></el-option>
                <el-option value="8" label="8"></el-option>
                <el-option value="9" label="9"></el-option>
              </el-select>
              <br /><br /><br />

              <div v-for="i in parseInt(iotSimpleConfig.cantidad)" :key="i">
                <base-input
                  v-model="iotSimpleConfig['nombre_' + i]"
                  :label="'Nombre ' + i + ' a mostrar'"
                  type="text"
                >
                </base-input>
                <br />
              </div>


              <br />

              <base-input
                v-model.number="iotSimpleConfig.unit_1"
                label="Unidad"
                type="text"
              >
              </base-input>

              <br />

              <el-select
                v-model="iotSimpleConfig.variable"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  v-for="(value, key) in variables"
                  :key="key"
                  :value="key"
                  :label="value.label"
                ></el-option>
              </el-select>

              <br />

              <el-select
                v-if="variables[iotSimpleConfig.variable]"
                v-model="iotSimpleConfig.subVariable"
                class="select-success"
                placeholder="Select SubVariable"
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="option in variables[iotSimpleConfig.variable]
                    .options"
                  :key="option"
                  :value="option"
                  :label="option"
                ></el-option>
              </el-select>


              <br />

              <el-select
                v-model="iotSimpleConfig.class"
                label="Color Fondo"
                class="select-success"
                placeholder="Seleccionar color"
                style="width: 100%"
              >
                <el-option value="success" label="success"></el-option>
                <el-option value="primary" label="primary"></el-option>
                <el-option value="secondary" label="secondary"></el-option>
                <el-option value="info" label="info"></el-option>
                <el-option value="warning" label="warning"></el-option>
                <el-option value="danger" label="danger"></el-option>
                <el-option value="light" label="light"></el-option>
                <el-option value="dark" label="dark"></el-option>
                <el-option value="Default" label="Default"></el-option>
                <el-option value="" label="Nada"></el-option>
              </el-select>

              <br />

              <el-select
                v-model="iotSimpleConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-2"
                  label="col-2"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM SWITCH TYPE -->
            <div v-if="widgetType == 'switch'">
              <base-input
                v-model="iotSwitchConfig.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotSwitchConfig.nombre"
                label="Nombre a mostrar"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="iotSwitchConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotSwitchConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotSwitchConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM BUTTON TYPE -->
            <div v-if="widgetType == 'button'">
              <base-input
                v-model="configButton.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="configButton.nombre"
                label="Nombre a mostrar"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="configButton.message"
                label="Message to send"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="configButton.text"
                label="Button Text"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="configButton.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="configButton.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="configButton.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM INDICATOR TYPE -->
            <div v-if="widgetType == 'indicator'">
              <base-input
                v-model="iotIndicatorConfig.NameWidget"
                label="Var Name"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="iotIndicatorConfig.nombre"
                label="Nombre a mostrar"
                type="text"
              >
              </base-input>
              <br />

              <base-input
                v-model="iotIndicatorConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="iotIndicatorConfig.variableSendFreq"
                label="Send Freq"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotIndicatorConfig.width"
                class="select-success"
                placeholder="Select Width"
                width="50"
              >
                <el-option
                  class="text-dark"
                  width="100"
                  label="100%"
                ></el-option>
                <el-option class="text-dark" width="50" label="50%"></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotIndicatorConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="Success"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="Primary"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="Warning"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="Danger"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotIndicatorConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%"
              >
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="col-6"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="col-12"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <div v-if="widgetType == 'TableSimple'">


              <el-select
                  v-model="TableSimpleConfig.cantidad_columnas"
                  placeholder="Select Cantidad de columnas"
                  class="select-success"
                  style="width: 100%"
                  @change="updateMatriz"
                >
                <el-option value="1" label="1"></el-option>
                <el-option value="2" label="2"></el-option>
                <el-option value="3" label="3"></el-option>
                <el-option value="4" label="4"></el-option>
                <el-option value="5" label="5"></el-option>
                <el-option value="6" label="6"></el-option>
                <el-option value="7" label="7"></el-option>
                <el-option value="8" label="8"></el-option>
                <el-option value="9" label="9"></el-option>
              </el-select>
              <br /><br /><br />

              <div v-for="i in parseInt(TableSimpleConfig.cantidad_columnas)" :key="i">
                <base-input
                  v-model="TableSimpleConfig['nombre_columna_' + i]"
                  :label="'Nombre columna' + i + ' a mostrar'"
                  type="text"
                >
                </base-input>
                <br />
              </div>

              <el-select
                           v-model="TableSimpleConfig.cantidad"
               class="select-success"
               placeholder="Select Quantity"
               style="width: 100%"
               @change="updateMatriz"
             >

                <el-option value="1" label="1"></el-option>
                <el-option value="2" label="2"></el-option>
                <el-option value="3" label="3"></el-option>
                <el-option value="4" label="4"></el-option>
                <el-option value="5" label="5"></el-option>
                <el-option value="6" label="6"></el-option>
                <el-option value="7" label="7"></el-option>
                <el-option value="8" label="8"></el-option>
                <el-option value="9" label="9"></el-option>
              </el-select>
              <br /><br /><br />

              <div v-for="i in parseInt(TableSimpleConfig.cantidad)" :key="i">
                <base-input
                  v-model="TableSimpleConfig['nombre_' + i]"
                  :label="'Nombre ' + i + ' a mostrar'"
                  type="text"
                >
                </base-input>
                <br />
              </div>


              <br />

              <base-input
                v-model.number="TableSimpleConfig.unit_1"
                label="Unidad"
                type="text"
              >
              </base-input>

              <br />

              <el-select
                v-model="TableSimpleConfig.variable"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%"
              >
                <el-option
                  v-for="(value, key) in variables"
                  :key="key"
                  :value="key"
                  :label="value.label"
                ></el-option>
              </el-select>

              <br />

              <el-select
                v-if="variables[TableSimpleConfig.variable]"
                v-model="TableSimpleConfig.subVariable"
                class="select-success"
                placeholder="Select SubVariable"
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="option in variables[TableSimpleConfig.variable]
                    .options"
                  :key="option"
                  :value="option"
                  :label="option"
                ></el-option>
              </el-select>

              <br />

              <base-input
                v-model.number="TableSimpleConfig.decimalPlaces"
                label="Decimal Places"
                type="number"
              >
              </base-input>

              <br />

              <base-input
                v-model="TableSimpleConfig.Matriz"
                label="Matriz"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="TableSimpleConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="TableSimpleConfig.variableSendFreq"
                label="Send Freq"
                type="number"
              ></base-input>
            </div>
          </div>

          <!-- WIDGET PREVIEW -->
          <div class="col-6">
            <Rtnumberchart
              v-if="widgetType == 'numberchart'"
              :config="ncConfig"
            ></Rtnumberchart>
            <DataBetween
              v-if="widgetType == 'DataBetween'"
              :config="DataBetweenConfig"
            ></DataBetween>
            <EnergyChart
              v-if="widgetType == 'multiple_chart'"
              :config="MultipleChartConfig"
            ></EnergyChart>
            <CostComponent
              v-if="widgetType == 'costcomponent'"
              :config="CostComponentConfig"
            ></CostComponent>

            <SmoothChart
              v-if="widgetType == 'smoothchart'"
              :config="SmoothChartConfig"
            ></SmoothChart>
            <Iotswitch
              v-if="widgetType == 'switch'"
              :config="iotSwitchConfig"
            ></Iotswitch>
            <Iotbutton
              v-if="widgetType == 'button'"
              :config="configButton"
            ></Iotbutton>
            <Iotindicator
              v-if="widgetType == 'indicator'"
              :config="iotIndicatorConfig"
            ></Iotindicator>
            <Simple
              v-if="widgetType == 'simple'"
              :config="iotSimpleConfig"
            ></Simple>

            <SimpleTable
              v-if="widgetType == 'TableSimple'"
              :config="TableSimpleConfig"
            ></SimpleTable>
          </div>
        </div>

        <!-- ADD WIDGET BUTTON -->

        <div class="row pull-right">
          <div class="col-12">
            <div class="row">
              <el-select
                v-model="selectedTemplate"
                class="select-success"
                placeholder="Select Template"
                style="width: 100%"
              >
                <el-option
                  v-for="item in templates"
                  :key="item._id"
                  :label="item.name"
                  :value="item"
                  class="text-dark"
                >
                </el-option>
              </el-select>
            </div>
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              @click="addNewWidgetToTemplate()"
            >
              Confirm Template Selection
            </base-button>
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3"
              size="lg"
              @click="addNewWidget()"
            >
              Add Widget
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DASHBOARD PREVIEW -->
    <div class="row">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="fa fa-trash text-warning pull-right"
          @click="deleteWidget(index)"
          style="margin-bottom: 10px"
        ></i>
        <Rtnumberchart
          v-if="widget.widget == 'numberchart'"
          :config="widget"
        ></Rtnumberchart>
        <DataBetween
          v-if="widget.widget == 'DataBetween'"
          :config="widget"
        ></DataBetween>
        <RtChartHistoric
          v-if="widget.widget == 'charthistoric'"
          :config="widget"
        ></RtChartHistoric>
        <RTDoblechart
          v-if="widget.widget == 'doblechart'"
          :config="widget"
        ></RTDoblechart>
        <EnergyChart
          v-if="widget.widget == 'multiple_chart'"
          :config="widget"
        ></EnergyChart>
        <DobleValue
          v-if="widget.widget == 'doblevalue'"
          :config="widget"
        ></DobleValue>
        <CostComponent
          v-if="widget.widget == 'costcomponent'"
          :config="widget"
        ></CostComponent>
        <SmoothChart
          v-if="widget.widget == 'smoothchart'"
          :config="widget"
        ></SmoothChart>

        <Iotswitch
          v-if="widget.widget == 'switch'"
          :config="widget"
        ></Iotswitch>

        <Iotbutton
          v-if="widget.widget == 'button'"
          :config="widget"
        ></Iotbutton>

        <Iotindicator
          v-if="widget.widget == 'indicator'"
          :config="widget"
        ></Iotindicator>

        <SimpleTable
          v-if="widget.widget == 'TableSimple'"
          :config="widget"
        ></SimpleTable>

        <Simple v-if="widget.widget == 'simple'" :config="widget"> </Simple>
      </div>
    </div>

    <!-- SAVE TEMPLATE FORM-->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">Save Template</h4>
        </div>

        <div class="row">
          <base-input
            class="col-4"
            v-model="templateName"
            label="Template Name"
            type="text"
          >
          </base-input>

          <base-input
            class="col-8"
            v-model="templateDescription"
            label="Template Description"
            type="text"
          >
          </base-input>
        </div>

        <br /><br />

        <div class="row">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3 pull-right"
              size="lg"
              @click="saveTemplate()"
              :disabled="widgets.length == 0"
            >
              Save Template
            </base-button>
            <base-button
              native-type="submit"
              type="primary"
              class="mb-3 pull-right"
              size="lg"
              @click="saveTemplateHistorical()"
              :disabled="widgets.length == 0"
            >
              Save Template Historical
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- TEMPLATES TABLE -->
    <div class="row">
      <b-card>
        <div slot="header">
          <h4 class="card-title">Templates</h4>
        </div>

        <div class="row">
          <el-table :data="templates">
            <el-table-column min-width="50" label="#" align="center">
              <div class="photo" slot-scope="{ row, $index }">
                {{ $index + 1 }}
              </div>
            </el-table-column>

            <el-table-column prop="name" label="Name"></el-table-column>

            <el-table-column
              prop="description"
              label="Description"
            ></el-table-column>

            <el-table-column
              prop="widgets.length"
              label="Widgets"
            ></el-table-column>

            <el-table-column header-align="right" align="right" label="Actions">
              <div
                slot-scope="{ row, $index }"
                class="text-right table-actions"
              >
                <el-tooltip
                  content="Delete"
                  effect="light"
                  :open-delay="300"
                  placement="top"
                >
                  <base-button
                    @click="deleteTemplate(row)"
                    type="danger"
                    icon
                    size="sm"
                    class="btn-link"
                  >
                    <i class="tim-icons icon-simple-remove"></i>
                  </base-button>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

export default {
  middleware: "authenticated",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      TableSimpleConfig: {
        variable: "",
        subVariable: [],
        NameWidget: "",
      },

      MultipleChartConfig: {
        variable: "",
        subVariable: [],
        NameWidget: "",
      },
      variables: {
        Yb7TcLx9pK: {
          label: "VoltajeData",
          options: [
            "Vrms",
            "max_vrms_carga_fase_1",
            "min_vrms_carga_fase_1",
            "avg_vrms_carga_fase_1",
            "max_fd_voltage_carga_fase_1",
            "min_fd_voltage_carga_fase_1",
            "avg_fd_voltage_carga_fase_1",
            "max_dat_voltage_carga_fase_1",
            "min_dat_voltage_carga_fase_1",
            "avg_dat_voltage_carga_fase_1",
          ],
        },
        Qf4GjSd2hN: {
          label: "CorrienteData",
          options: [
            "Irms",
            "max_irms_carga_fase_1",
            "min_irms_carga_fase_1",
            "avg_irms_carga_fase_1",
            "max_fd_current_carga_fase_1",
            "min_fd_current_carga_fase_1",
            "avg_fd_current_carga_fase_1",
            "max_dat_current_carga_fase_1",
            "min_dat_current_carga_fase_1",
            "avg_dat_current_carga_fase_1",
          ],
        },
      },

      widgets: [],
      selectedTemplate: null,
      templates: [],
      templatesHistorical: [],
      widgetType: "",
      templateName: "",
      templateDescription: "",

      ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        NameWidget: "temperature",
        nombre: "Voltaje",
        variable: "varname", //variable es la var name interna
        variableType: "input",
        variableSendFreq: "30",
        unit: "Watts",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "numberchart",
        icon: "",
        chartTimeAgo: 60,
        demo: true,
        tipo: "",
        animacion: 2000,
        historical: "",
      },

      DataBetweenConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        NameWidget: "temperature",
        nombre: "Voltaje",
        variable: "varname", //variable es la var name interna
        variableType: "input",
        unit: "Watts",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "DataBetween",
        icon: "",
        demo: true,
        tipo: "",
        animacion: 2000,
      },

      MultipleChartConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre_1: "Voltaje",
        cantidad: 1,
        NameWidget: "Voltaje",
        variable: "varname", //variable es la var name interna
        variableType: "input",
        variableSendFreq: "30",
        unit_1: "C",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "multiple_chart",
        icon: "",
        chartTimeAgo: 60,
        demo: true,
        TipoGrafico: "",
        animacion: 2000,
      },

      SmoothChartConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre: "Voltaje",
        NameWidget: "temperature",
        variable: "varname", //variable es la var name interna
        variableType: "input",
        variableSendFreq: "30",
        unit: "C",
        unit2: "%",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "smoothchart",
        icon: "",
        chartTimeAgo: 60,
        demo: true,
        historical: true,
      },

      iotSwitchConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre: "Voltaje",
        NameWidget: "Luz",
        variable: "varname",
        variableType: "output",
        class: "danger",
        widget: "switch",
        icon: "",
        column: "col-6",
        historical: false,
      },

      iotIndicatorConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre: "Voltaje",
        NameWidget: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        style: "50",
        class: "success",
        widget: "indicator",
        icon: "",
        column: "col-6",
        historical: false,
      },

      configButton: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false,
        },
        nombre: "Voltaje",
        NameWidget: "Pump",
        variable: "var1",
        variableType: "output",
        icon: "",
        column: "col-4",
        widget: "button",
        class: "danger",
        message: "{'fanstatus': 'stop'}",
      },

      CostComponentConfig: {
        //mio
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre: "Voltaje",
        NameWidget: "temperature",
        unit: "Watts",
        variableType: "input",
        variableSendFreq: "30",
        decimalPlaces: 2,
        class: "info",
        widget: "simple",
        column: "col-4",
        textvariant: "white",
        header: "Primary",
        type: "Voltage_Phase_2",
        variable: "Voltage",
      },

      iotSimpleConfig: {
        //mio
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre_1: "Voltaje",
        cantidad: 1,
        NameWidget: "temperature",
        unit_1: "Watts",
        variableType: "input",
        variableSendFreq: "30",
        decimalPlaces: 2,
        class: "info",
        widget: "simple",
        column: "col-4",
        textvariant: "white",
        header: "Primary",
        variable: "Voltage",
      },

      TableSimpleConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
        },
        nombre_1: "Voltaje",
        cantidad: 1,
        NameWidget: "Voltaje",
        variable: "varname", //variable es la var name interna
        variableType: "input",
        variableSendFreq: "30",
        unit_1: "C",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "TableSimple",
        icon: "",
        chartTimeAgo: 60,
        demo: true,
        TipoGrafico: "",
        animacion: 2000,
        cantidad_columnas: 1,
        Matriz: "2,2"
      },
    };
  },

  mounted() {
    this.getTemplates();
  },

  watch: {
    "TableSimpleConfig.subVariable": "updateFields",
    "TableSimpleConfig.cantidad"(newVal, oldVal) {
      if (newVal > oldVal) {
        // Si se incrementa la cantidad, inicializar los nuevos campos
        for (let i = oldVal + 1; i <= newVal; i++) {
          this.$set(this.TableSimpleConfig, `nombre_${i}`, "");
          this.$set(this.TableSimpleConfig, `unit_${i}`, "");
        }
      } else if (newVal < oldVal) {
        // Si se disminuye la cantidad, eliminar los campos que ya no se necesitan
        for (let i = oldVal; i > newVal; i--) {
          this.$delete(this.TableSimpleConfig, `nombre_${i}`);
          this.$delete(this.TableSimpleConfig, `unit_${i}`);
        }
      }
    },
    "MultipleChartConfig.subVariable": "updateNameWidget",

    // Observar cambios en la propiedad cantidad
    "MultipleChartConfig.cantidad"(newVal, oldVal) {
      if (newVal > oldVal) {
        // Si se incrementa la cantidad, inicializar los nuevos campos
        for (let i = oldVal + 1; i <= newVal; i++) {
          this.$set(this.MultipleChartConfig, `nombre_${i}`, "");
          this.$set(this.MultipleChartConfig, `unit_${i}`, "");
        }
      } else if (newVal < oldVal) {
        // Si se disminuye la cantidad, eliminar los campos que ya no se necesitan
        for (let i = oldVal; i > newVal; i--) {
          this.$delete(this.MultipleChartConfig, `nombre_${i}`);
          this.$delete(this.MultipleChartConfig, `unit_${i}`);
        }
      }
    },

    "iotSimpleConfig.subVariable": "updateNameWidget_simple_widget",

    // Observar cambios en la propiedad cantidad
    "iotSimpleConfig.cantidad"(newVal, oldVal) {
      if (newVal > oldVal) {
        // Si se incrementa la cantidad, inicializar los nuevos campos
        for (let i = oldVal + 1; i <= newVal; i++) {
          this.$set(this.iotSimpleConfig, `nombre_${i}`, "");
          this.$set(this.iotSimpleConfig, `unit_${i}`, "");
        }
      } else if (newVal < oldVal) {
        // Si se disminuye la cantidad, eliminar los campos que ya no se necesitan
        for (let i = oldVal; i > newVal; i--) {
          this.$delete(this.iotSimpleConfig, `nombre_${i}`);
          this.$delete(this.iotSimpleConfig, `unit_${i}`);
        }
      }
    },

  },

  methods: {

    updateMatriz() {
    this.TableSimpleConfig.Matriz = this.TableSimpleConfig.cantidad + ',' + this.TableSimpleConfig.cantidad_columnas;
    },

    updateNameWidget() {
      if (this.MultipleChartConfig.subVariable.length > 0) {
        // utiliza join para convertir el array a una cadena separada por comas
        this.MultipleChartConfig.NameWidget =
          this.MultipleChartConfig.subVariable.join(",");
      }
    },

    updateNameWidget_simple_widget() {
      if (this.iotSimpleConfig.subVariable.length > 0) {
        // utiliza join para convertir el array a una cadena separada por comas
        this.iotSimpleConfig.NameWidget =
          this.iotSimpleConfig.subVariable.join(",");
      }
    },

    updateFields() {
      if (this.TableSimpleConfig.subVariable.length > 0) {
        // utiliza join para convertir el array a una cadena separada por comas
        this.TableSimpleConfig.NameWidget =
          this.TableSimpleConfig.subVariable.join(",");
      }
    },
    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };

      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        //console.log(res.data);
        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates...",
        });
        console.log(error);
        return;
      }
    },
    //Save Template
    async saveTemplate() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      //console.log(axiosHeaders);
      const toSend = {
        template: {
          name: this.templateName,
          description: this.templateDescription,
          widgets: this.widgets,
        },
      };
      try {
        const res = await this.$axios.post("/template", toSend, axiosHeaders);

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Template created!",
          });
          this.getTemplates();

          this.widgets = [];
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error creating template...",
        });
        console.log(error);
        return;
      }
    },

    //Delete Template
    async deleteTemplate(template) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
        params: {
          templateId: template._id,
        },
      };

      console.log(axiosHeaders);

      try {
        const res = await this.$axios.delete("/template", axiosHeaders);

        console.log(res.data);

        if (res.data.status == "fail" && res.data.error == "template in use") {
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message:
              template.name +
              " is in use. First remove the devices linked to the template!",
          });

          return;
        }

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-check-2",
            message: template.name + " was deleted!",
          });

          this.getTemplates();
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error getting templates...",
        });
        console.log(error);
        return;
      }
    },

    //Add Widget
    addNewWidget() {
      if (this.widgetType == "numberchart") {
        this.ncConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
      }

      if (this.widgetType == "DataBetween") {
        this.DataBetweenConfig.idChart = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.DataBetweenConfig)));
      }

      if (this.widgetType == "smoothchart") {
        this.SmoothChartConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.SmoothChartConfig)));
      }

      if (this.widgetType == "switch") {
        this.iotSwitchConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotSwitchConfig)));
      }

      if (this.widgetType == "button") {
        this.configButton.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.configButton)));
      }

      if (this.widgetType == "indicator") {
        this.iotIndicatorConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotIndicatorConfig)));
      }

      if (this.widgetType == "simple") {
        //this.iotSimpleConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotSimpleConfig)));
      }

      if (this.widgetType == "costcomponent") {
        //this.CostComponentConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.CostComponentConfig)));
      }

      if (this.widgetType == "multiple_chart") {
        this.MultipleChartConfig.idChart = this.makeid(10);
        //this.MultipleChartConfig.variable2 = this.makeid(10);
        //this.MultipleChartConfig.variable3 = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.MultipleChartConfig)));
      }

      if (this.widgetType == "TableSimple") {
        this.TableSimpleConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.TableSimpleConfig)));
      }
    },

    async addNewWidgetToTemplate() {
      if (!this.selectedTemplate) {
        return;
      }
      console.log("Template seleccionado");
      console.log(this.selectedTemplate);
      console.log(this.widgetType);
      let UpdateObject;
      if (this.widgetType == "simple") {
        //this.iotSimpleConfig.variable = this.makeid(10);
        UpdateObject = JSON.parse(JSON.stringify(this.iotSimpleConfig));
      }

      if (this.widgetType == "multiple_chart") {
        UpdateObject = JSON.parse(JSON.stringify(this.MultipleChartConfig));
      }

      if (this.widgetType == "TableSimple") {

        UpdateObject = JSON.parse(JSON.stringify(this.TableSimpleConfig));
      }
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      console.log("UpdateObject");
      console.log(UpdateObject);

      //console.log($store.state.selectedDevice.template.widgets)
      //console.log($store.state.devices.length)

      const toSend = {
        widget: UpdateObject,
        templateName: this.selectedTemplate.name,
      };

      try {
        // Suponiendo que tienes una ruta '/template/test' en tu servidor para pruebas
        const res = await this.$axios.post(
          "UpdateTemplate",
          toSend,
          axiosHeaders
        );

        if (res.data.status == "success") {
          this.$notify({
            type: "success",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Test successful!",
          });
        }
      } catch (error) {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Test error...",
        });
        console.log(error);
      }
    },

    //Delete Widget
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },

    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
};
</script>
