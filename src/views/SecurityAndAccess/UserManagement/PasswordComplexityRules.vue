<template>
  <b-container fluid="xl">
    <b-form>
      <div class="form-background p-3">
        <b-form-group>
          <h5 class="bold">
            {{
              $t(
                'pageUserManagement.passwordRules.passwordForHigh.passwordComplexityForHigh'
              )
            }}
          </h5>
          <ul>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForHigh.rule2') }}
            </li>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForHigh.rule3') }}
              <ul>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForHigh.rule4')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForHigh.rule5')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForHigh.rule6')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForHigh.rule7')
                  }}
                </li>
              </ul>
            </li>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForHigh.rule8') }}
            </li>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForHigh.rule9') }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordForHigh.rule10')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordForHigh.rule11')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordForHigh.rule12')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordForHigh.rule13')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordForHigh.rule14')
              }}
            </li>
          </ul>
          <h5 class="bold">
            {{
              $t(
                'pageUserManagement.passwordRules.passwordFormedium.passwordComplexityFormedium'
              )
            }}
          </h5>
          <ul>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordFormedium.rule2')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordFormedium.rule3')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordFormedium.rule4')
              }}
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordFormedium.rule5')
              }}
              <ul>
                <li>
                  {{
                    $t(
                      'pageUserManagement.passwordRules.passwordFormedium.rule6'
                    )
                  }}
                </li>
                <li>
                  {{
                    $t(
                      'pageUserManagement.passwordRules.passwordFormedium.rule7'
                    )
                  }}.
                </li>
                <li>
                  {{
                    $t(
                      'pageUserManagement.passwordRules.passwordFormedium.rule8'
                    )
                  }}
                </li>
                <li>
                  {{
                    $t(
                      'pageUserManagement.passwordRules.passwordFormedium.rule9'
                    )
                  }}
                </li>
              </ul>
            </li>
            <li>
              {{
                $t('pageUserManagement.passwordRules.passwordFormedium.rule10')
              }}
            </li>
          </ul>
          <h5 class="bold">
            {{
              $t(
                'pageUserManagement.passwordRules.passwordForLow.passwordComplexityForLow'
              )
            }}
          </h5>
          <ul>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForLow.rule2') }}
            </li>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForLow.rule3') }}
              <ul>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForLow.rule4')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForLow.rule5')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForLow.rule6')
                  }}
                </li>
                <li>
                  {{
                    $t('pageUserManagement.passwordRules.passwordForLow.rule7')
                  }}
                </li>
              </ul>
            </li>
            <li>
              {{ $t('pageUserManagement.passwordRules.passwordForLow.rule8') }}
            </li>
          </ul>
        </b-form-group>
        <div class="bold">
          <span>{{ 'Note: ' }}</span
          >{{ $t('pageUserManagement.note') }}
        </div>
      </div>
    </b-form>
  </b-container>
</template>

<script>
export default {};
</script>

<style scoped>
.bold {
  font-weight: 700;
}
</style>
